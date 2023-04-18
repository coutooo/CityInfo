#!/bin/bash
sawtooth keygen --force sawtooth && tail -f /dev/null

python3 cityinfo_commands.py &