# ticketing_app-microservices

Instructions:

1. Apply this kubectl command manually. Reapply this command each time you restart k8 cluster locally:
```
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret-key-string>
```
2. Run test Cases:
```
    npm run test
```