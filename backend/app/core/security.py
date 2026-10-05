from typing import Annotated

from pydantic import StringConstraints
from starlette.types import ASGIApp, Message, Receive, Scope, Send

# Every client-chosen identifier (section slugs, pin keys, checklist keys)
# must look like this. Keeps junk and injection-shaped strings out of the DB.
Slug = Annotated[str, StringConstraints(pattern=r"^[a-z0-9][a-z0-9-]{0,63}$")]

_API_HEADERS: list[tuple[bytes, bytes]] = [
    (b"x-content-type-options", b"nosniff"),
    (b"referrer-policy", b"no-referrer"),
    (b"cache-control", b"no-store"),
    (b"cross-origin-resource-policy", b"same-origin"),
]


class SecurityHeadersMiddleware:
    """Pure ASGI (not BaseHTTPMiddleware): adds headers without buffering bodies.

    nginx sets page-level headers (CSP etc.); these cover the API even when it
    is hit directly, e.g. on a future deploy without nginx in front.
    """

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        async def send_with_headers(message: Message) -> None:
            if message["type"] == "http.response.start":
                message["headers"] = [*message.get("headers", ()), *_API_HEADERS]
            await send(message)

        await self.app(scope, receive, send_with_headers)
