from llama_index.core.retrievers import NLSQLRetriever
from llama_index.core.schema import QueryBundle, TextNode, NodeWithScore
import logging



from llama_index.core.retrievers import NLSQLRetriever
from llama_index.core.schema import QueryBundle, TextNode, NodeWithScore
import logging


class CustomNLSQLRetriever(NLSQLRetriever):
    """
    Custom NLSQLRetriever that allows passing additional context like abbreviation scores.

    This customization stores the additional context as instance variables and uses them
    in the retrieval process.
    """

    def __init__(self, *args, **kwargs):
        """Initialize with parent constructor arguments."""
        super().__init__(*args, **kwargs)
        # Initialize variables to store context that will be set later
        self._current_abbrev_scores = None
        self._current_credit_scores = None

    def retrieve(self, query_str, abbrev_and_scores=None, credit_and_scores=None):
        """Store context and call parent retrieve."""
        self._current_abbrev_scores = abbrev_and_scores
        self._current_credit_scores = credit_and_scores
        return super().retrieve(query_str)

    def _retrieve(self, query_bundle):
        """Follow parent pattern - call retrieve_with_metadata and discard metadata."""
        retrieved_nodes, _ = self.retrieve_with_metadata(query_bundle)
        return retrieved_nodes

    def retrieve_with_metadata(self, query_str):
        """
        Retrieve with metadata and additional context.
        """

        # Convert to QueryBundle if necessary
        if isinstance(query_str, str):
            query_bundle = QueryBundle(query_str)
        else:
            query_bundle = query_str

        # Get table context
        table_desc_str = self._get_table_context(query_bundle)
        if self._verbose:
            print(f"> Table desc str: {table_desc_str}")

        abbrev_and_scores = {}
        for entry in self._current_abbrev_scores:
            deparment = entry[0].page_content
            abbrev = deparment.split(':', 1)[1].strip()
            abbrev_and_scores[abbrev] = entry[1]
            abbrevs = ", ".join(abbrev_and_scores.keys())

        # Use the stored context in your logic if needed
        # ...

        # Continue with standard implementation
        response_str = self._llm.predict(
            self._text_to_sql_prompt,
            query_str=query_bundle.query_str,
            schema=table_desc_str,
            dialect=self._sql_database.dialect,
            dept_abbrevs = abbrevs
        )

        sql_query_str = self._sql_parser.parse_response_to_sql(
            response_str, query_bundle
        )

        if self._verbose:
            print(f"> Predicted SQL query: {sql_query_str}")

        if self._sql_only:
            sql_only_node = TextNode(text=f"{sql_query_str}")
            retrieved_nodes = [NodeWithScore(node=sql_only_node)]
            metadata = {"result": sql_query_str}
        else:
            try:
                retrieved_nodes, metadata = self._sql_retriever.retrieve_with_metadata(
                    sql_query_str
                )
            except BaseException as e:
                if self._handle_sql_errors:
                    err_node = TextNode(text=f"Error: {e!s}")
                    retrieved_nodes = [NodeWithScore(node=err_node)]
                    metadata = {}
                else:
                    raise

        return retrieved_nodes, {"sql_query": sql_query_str, **metadata}