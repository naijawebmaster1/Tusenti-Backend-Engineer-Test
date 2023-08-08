import { createClient } from 'redis';

const redisUrl = 'redis://localhost:6379';

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
    setTimeout(connectRedis, 5000);
  }
};

connectRedis();

export default redisClient;
