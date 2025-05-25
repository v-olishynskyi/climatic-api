import jwt from './jwt.config';
import mail from './mail.config';
import database from './db.config';
import redis from './redis.config';
import app from './app.config';
import rabbitmq from './app.config';

export default [jwt, mail, database, redis, app, rabbitmq];
