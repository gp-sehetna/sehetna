from pydantic_ai import Agent, PromptedOutput
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.providers.groq import GroqProvider

from src.application.agents.prompts import INTERPRETER_SYSTEM_PROMPT
from src.core.settings import Settings
from src.domain.schemas.agent import InterpretationResult


def build_interpreter_agent(settings: Settings):
    # Groq Compound
    model = GroqModel(model_name="groq/compound", provider=GroqProvider(api_key=settings.api_key))

    # Qwen 3.5-27B
    # model = OpenAIChatModel(
    #     model_name="Qwen/Qwen3.5-27B",
    #     provider=OpenAIProvider(base_url="https://router.huggingface.co/v1/", api_key=settings.api_key),
    # )

    # Gemma 4-26B (slow but best performance)
    # model = GoogleModel( model_name="gemma-4-26b-a4b-it", provider=GoogleProvider(api_key=settings.api_key))

    # llama3.1-8b
    # model = OpenAIChatModel(
    #     model_name="llama3.1-8b", provider=OpenAIProvider(base_url="https://api.cerebras.ai/v1", api_key=settings.api_key)
    # )

    agent = Agent(
        model=model,
        output_type=PromptedOutput(InterpretationResult),
        system_prompt=INTERPRETER_SYSTEM_PROMPT,
    )

    return agent
