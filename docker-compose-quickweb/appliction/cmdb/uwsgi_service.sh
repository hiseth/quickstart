#!/bin/bash
uwsgi --ini /usr/src/apps/uwsgi.ini
tail -f /tmp/app.log
