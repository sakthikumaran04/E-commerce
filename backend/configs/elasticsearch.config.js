import { Client } from "@elastic/elasticsearch";

const client = new Client({
  node: "https://localhost:9200",
  auth: {
    username: "elastic",
    password: "=Acv=NWk+=HoMSLXC6Wj", 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export default client;
