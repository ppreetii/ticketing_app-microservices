# Ticketing App

### About:
It is a microservice-based NodeJS Web App, where a user can create account, and start selling tickets. LoggedIn user can also buy tickets from other users. Tickets can be various types like film, sports, concert, etc. A user, who buys a ticket, has lock period of 2 minutes, within which noone else can buy/update the ticket. The user has to complete the transaction within that 2 minutes, otherwise ticket is freed for other users' to buy.

### Project Highlights:
1. Type Safety
2. Seperation of Concern
3. Centralised Error Handling and middlewares
4. Common Repo as npm package used by other services
5. Async Execution
6. Robust Unit Tests 
7. Restricted APIS with JWT authentication
8. Best practices in communication between different services
9. Event-based communication between Services
10. Production-level Code

### Tech Stack:
- **UI:** NextJS with Bootstrap
- **Backend:** NodeJS, Express
- **Database:** MongoDb with Mongoose ODM
- **Request body Validation:** express-validator
- **Testing:** Jest
- **Containerisation and Orchestartion:** Docker, Kubernetes
- **Message Queue:** Nats Streaming Server
- **Authentication:** JWT and session
- **CI/CD:** Github Actions

### Instructions:

1. Apply this kubectl command manually:
```
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret-key>
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<stripe-secret-key>
```
2. Install [ingress-nginx](https://kubernetes.github.io/ingress-nginx/deploy/) (the load balancer service that will interact with Load Balancer of Cloud Provider) by applying yaml file.It is basically set of rules that will distribute traffic to correct pods in our cluster based on path requested. 
```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml
```
3. Check if secrets are added.If you donot see the secrets , reapply them using above command:
```
kubectl get secrets
```
4. Run test Cases:
```
    npm run test
```