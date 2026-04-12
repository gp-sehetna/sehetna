import json
import logging
import time

from pydantic_ai import Agent

from src.application.agents.prompts import INTERPRETER_PROMPT
from src.core.exceptions import AgentInferenceError
from src.domain.schemas.agent import InterpretationResult
from src.domain.schemas.predictions import PredictionResult

logger = logging.getLogger(__name__)


class AgentService:
    def __init__(self, agent: Agent[None, InterpretationResult]):
        self._agent = agent

    async def interpret(self, country: str, simulation_outcomes: PredictionResult, environmental_data: dict):
        _t_start = time.perf_counter()
        prompt = self._build_prompt(country, simulation_outcomes, environmental_data)

        try:
            result = await self._agent.run(prompt)
            return result.output
        except Exception as exc:
            raise AgentInferenceError(f"Interpreter agent failed: {exc}") from exc
        finally:
            _t_elapsed = time.perf_counter() - _t_start
            logger.info(f"Interpretation completed in {_t_elapsed:.2f} seconds")

    @staticmethod
    def _build_prompt(country: str, simulation_outcomes: PredictionResult, environmental_data: dict):
        return INTERPRETER_PROMPT.format(
            country=country,
            env=json.dumps(environmental_data, ensure_ascii=False, separators=(",", ":")),
            outcomes=json.dumps(simulation_outcomes.model_dump(), ensure_ascii=False, separators=(",", ":")),
        )
