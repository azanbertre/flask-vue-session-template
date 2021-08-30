from app import app_context_command

import fire


class CmdLine:
    @app_context_command
    def test(self):
        print("test")


if __name__ == "__main__":
    fire.Fire(CmdLine)
