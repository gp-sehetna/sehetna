from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIChatModel
from pydantic_ai.providers.openai import OpenAIProvider

from src.core.settings import Settings


def build_interpreter_agent(settings :Settings) -> Agent[None, str]:
    """
    Build and return the PydanticAI interpreter agent.
 
    The agent uses a Groq-hosted Qwen model via the OpenAI-compatible
    provider, and returns a plain-text human-readable message.
    """
    apiKey = "csk-npdfdmxy9tpmpj36kxjkm28ve8ypytmwhnrejtmnctnehj98"
    model_name = "llama3.1-8b"
    model = OpenAIChatModel(
        model_name=model_name,
        provider=OpenAIProvider(
            base_url="https://api.cerebras.ai/v1", 
            api_key=apiKey,
        ),
    )

    agent: Agent[None, str] = Agent(
        model=model,
        output_type=str,
        system_prompt=(
            "You are a public-health and environmental expert assistant. "
            "You receive two blocks of data: (1) the environmental conditions "
            "(air quality, temperature, humidity, etc.) that were used as input "
            "to a climate-health simulation for a specific country, and "
            "(2) the five predicted health outcomes produced by that simulation: "
            "respiratory disease rate, cardiovascular mortality rate, "
            "vector-borne disease risk score, waterborne disease incidents, "
            "and heat-related hospital admissions. "
            "\n\n"
            "Your job is to write a clear, friendly paragraph (4-6 sentences) "
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
            "- Keep the response under 50 words."
        ),
    )


    return agent