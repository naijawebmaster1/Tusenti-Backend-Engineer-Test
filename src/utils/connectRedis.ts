import config from 'config';
import { createClient } from 'redis';


const redisMURL = config.get<string>('redisURL');


const redisUrl = redisMURL;

const redisClient = createClient({
  url: redisUrl,
});

const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Redis client connect successfully');
    redisClient.set('try', 'Hello Welcome to tusenti-backend-engineering-test, we are happy to see you');
  }
  catch (error) {
    console.log(error);
    console.log("error connceting to reddis");
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
