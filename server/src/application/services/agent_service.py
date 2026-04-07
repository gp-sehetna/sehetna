import json

from pydantic_ai import Agent

from src.core.exceptions import AgentInferenceError
from src.domain.schemas.predictions import PredictionResult


class AgentService:
    """
    Application service that wraps the PydanticAI interpreter agent.

    Responsible for:
    - Formatting the prediction results into a prompt.
    - Calling the agent.
    - Returning the plain-text interpretation.
    """

    def __init__(self, agent: Agent) -> None:
        self._agent = agent

    async def interpret(self, country: str, simulation_outcomes: PredictionResult, environmental_data: dict):
        """
        Run the interpreter agent and return a human-readable message.

        Args:
            country: The country name or ISO3 code the prediction is for.
            prediction_results: Raw dict output from the LGBM model.

        Returns:
            A plain-text string interpretation of the results.

        Raises:
            AgentInferenceError: If the agent fails to produce a result.
        """
        prompt = self._build_prompt(country, simulation_outcomes, environmental_data)

        try:
            result = await self._agent.run(prompt)
            return result.output
        except Exception as exc:
            raise AgentInferenceError(f"Interpreter agent failed: {exc}") from exc

    @staticmethod
    def _build_prompt(country: str, simulation_outcomes: PredictionResult, environmental_data: dict):
        """Construct the structured user-turn prompt sent to the agent."""

        outcomes_str = json.dumps(simulation_outcomes.model_dump(), indent=2)
        env_str = json.dumps(environmental_data, indent=2)

        return (
            f"Country: {country}\n\n"
            "--- Environmental conditions used in simulation ---\n"
            f"{env_str}\n\n"
            "--- Predicted health outcomes ---\n"
            f"{outcomes_str}\n\n"
            "Using the environmental conditions as context, please interpret "
            "the predicted health outcomes for the user in plain language."
        )
