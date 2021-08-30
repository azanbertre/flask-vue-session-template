while true;
  do gunicorn -w=4 --bind 0.0.0.0:5556 "app:create_app()" --reload;
  echo Restarting in 5;
  sleep 5;
done;
