import axios from "axios";

export default ({ req }) => {
  if (typeof window === "undefined") {
    //we are on server
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
    /**
     The above will be replaced with purchased domain name for deployment
      return axios.create({
        baseURL: 'http://www.ticketing-app-prod.com/',     ---> this is fake url, won't work
        headers: req.headers,
      });
     */
  } else {
    //we are on browser
    return axios.create({
      baseURL: "/",
    });
  }
};
