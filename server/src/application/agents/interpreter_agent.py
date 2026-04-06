from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.models.groq import GroqModel
from pydantic_ai.providers.groq import GroqProvider
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider
from src.core.settings import Settings


def build_interpreter_agent(settings: Settings) -> Agent[None, str]:
    """
    • Test Models -> Xai, HuggingFace, Groq Compound
    • Front-End
    • Modify SYS prompt
    """
    # <-- Groq Compound -->
    model_name = "groq/compound"
    model = GroqModel(
        model_name=model_name,
        provider=GroqProvider(
            api_key=settings.api_key,
        ),
    )

    # <-- Qwen -->
    # apiKey =
    # model_name="Qwen/Qwen3.5-27B"
    # model = OpenAIChatModel(
    #     model_name=model_name,
    #     provider=OpenAIProvider(
    #         base_url="https://router.huggingface.co/v1/",
    #         api_key=settings.api_key,
    #     ),
    # )

    # <-- Gemma -->
    # Takes long time but best performance
    # model_name = "gemma-4-26b-a4b-it"
    # model = GoogleModel(
    #     model_name=model_name,
    #     provider=GoogleProvider(
    #         api_key=settings.api_key,
    #     ),
    # )

    # <-- llama3.1-8b -->
    # model_name = "llama3.1-8b"
    # model = OpenAIChatModel(
    #     model_name=model_name,
    #     provider=OpenAIProvider(
    #         base_url="https://api.cerebras.ai/v1",
    #         api_key=settings.api_key,
    #     ),
    # )

    agent: Agent[None, str] = Agent(
        model=model,
        output_type=str,
        system_prompt=(
            "You are a public-health and environmental expert assistant. "
            "You will receive:"
            "(1) Environmental data describing short-term conditions (e.g., temperature, air quality, precipitation),"
            "\n"
            "(2) Country-level indicators describing long-term socioeconomic conditions (e.g., GDP, food security, undernourishment),"
            "\n"
            "and (3) predicted health outcomes."
            "\n\n"
            "Your job is to write a clear, friendly paragraph "
            "that a non-technical user can understand. "
            "\n\n"
            "Guidelines:\n"
            "- Start by briefly describing the environmental conditions.\n"
            "- Explain what the 5 health outcomes mean in plain language.\n"
            "- Highlight the most critical or alarming indicator if any.\n"
            "- Link the environmental conditions to the health outcomes causally.\n"
            "- End with one practical public-health recommendation.\n"
            "- Always refer to the country by its full name using its provided code, never by its code or abbreviation "
            "(e.g., say 'Egypt' not 'EGY', 'United States' not 'USA').\n"
            "- Do NOT use bullet points, markdown, headers, or technical jargon.\n"
            "- Don't mention that the model forecasts the diseases.\n"
            "- Keep the response under 50 words."
        ),
    )

    return agent
