# ticketing_app-microservices

Instructions:

1. Apply this kubectl command manually:
```
    kubectl create secret generic jwt-secret --from-literal=JWT_KEY=<secret-key>
    kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<stripe-secret-key>
```
Check if secrets are added.If you donot see the secrets , reapply them using above command:
```
kubectl get secrets
```
2. Run test Cases:
```
    npm run test
```