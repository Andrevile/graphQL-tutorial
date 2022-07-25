import { request } from 'graphql-request';

const URL = 'http://localhost:8000/graphql';

export const fetcher = (query, variables = {}) => request(URL, query, variables);

/*
get: axios.get(url[,config])
delete: axios.delete(url[,config])
post: axios.post(url,data[,config])
put: axios.put(url,data[,config])
*/
