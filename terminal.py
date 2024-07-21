import asyncio
import websockets
import subprocess

async def execute_command(websocket, path):
    async for message in websocket:
        try:
            # Komutu çalıştır ve çıktıyı al
            result = subprocess.run(message, shell=True, capture_output=True, text=True)
            response = result.stdout + result.stderr
        except Exception as e:
            response = str(e)

        await websocket.send(response)

async def main():
    async with websockets.serve(execute_command, "192.168.1.50", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
