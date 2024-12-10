import { io } from 'socket.io-client';
import { getBaseUrl } from './Api';

const connectSocket = async () => {
  const baseUrl = await getBaseUrl();
  const socketUrl = baseUrl.replace('/api', '');
  return io(socketUrl);
};

export default connectSocket();