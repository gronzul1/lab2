# GrAwsLab


    Progettazione di un sito Web utilizzando la tecnologia serverless.
    Progetto di fine corso 2
    Descrizione

    Usa la tecnologia serverless per creare un sito Web di feedback.

    Descrizione:

    Nel modo "serverless" di fare le cose, non abbiamo bisogno di pensare ai server. Perché la pianificazione della capacità, la scalabilità, l'alta disponibilità e la tolleranza di errore, in genere previste da un server, vengono gestite automaticamente dal provider cloud. In questo caso, prenderemo in considerazione AWS (provider cloud). AWS offre una pletora di servizi che seguono il modello serverless, inclusi, a titolo esemplificativo, SNS, SQS, Lambda e SES. È possibile utilizzare questi servizi semplicemente abbonandosi a loro e senza effettivamente contattare il server. Ciò elimina la necessità di suddividere l'attenzione per garantire che tutti i sistemi siano aggiornati e mantenuti, consentendo di dedicare più tempo alle operazioni principali della propria attività.

    Spesso, le aziende ricevono feedback dai loro clienti. Una casa editrice di libri, ad esempio, prende il feedback sul libro appena pubblicato. Un'azienda cosmetica riceve feedback sul prodotto cosmetico appena lanciato. Quindi, dopo aver raccolto il feedback dei clienti, le aziende tendono ad aggregarli tutti per comprendere i problemi più comuni con il prodotto e di conseguenza modificare il prodotto e la strategia di marketing progettata per il prodotto.

    Fino ad ora, la raccolta del feedback richiedeva la creazione di un'istanza EC2, RDS Database, ecc. Ma, in questo caso d'uso, useremo le tecnologie "serverless" per creare un sito Web di feedback. I servizi da utilizzare e il loro scopo sono elencati di seguito:

    S3 – Per la memorizzazione delle pagine web
    DynamoDB – Per memorizzare i risultati del feedback
    Cognito – Per fornire al sito web l'accesso al database backend
    IAM – Per specificare quali autorizzazioni concedere
    Servizi AWS: S3, Cognito, IAM, DynamoDB

    Risultati attesi:

    Utilizzare la tecnologia serverless per creare un modulo di feedback
    Archivia i risultati in DynamoDB per ulteriori analisi



## Creazione IAM role 
gr-dynDB-role per accesso full della lambda a DynamoDB

## Creazione tabella users 
popolamento attraverso lo script js da fuori VPN

## Creazione della lambda fx gr-getUsers
https://docs.amplify.aws/guides/functions/dynamodb-from-js-lambda/q/platform/js/

## Creazione del API Gateway
abilitazione CORS 
inserimento nell'header della lambda dell'  headers: "Access-Control-Allow-Origin=*"

## creazione s3
copia della build del sito web nel s3 bucket
```shell
    ng build --configuration production
    cd dist\gr-aws-lab
    aws s3 cp . s3://gr-webapp1 --recursive
```

## google auth

url:    https://gr-appauth1.auth.us-east-1.amazoncognito.com

ID client: 562702776494-ltcl2p6ust066hahv21f2ed6hd59q02m.apps.googleusercontent.com

Client secret: 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



## problema headers
https://github.com/angular/angular/issues/33033
https://stackoverflow.com/questions/47805542/angular-httpclient-append-headers-to-httpheaders
https://www.lateralecloud.it/configurare-proxy-angular/


## S3
gr-feedback-bucket
aws s3 rm s3://gr-feedback-bucket  --recursive
aws s3 cp . s3://gr-feedback-bucket  --recursive



// gronzul@gmail.com
// Beppe123!
//eyJraWQiOiJHN3djbFFVZ3I2dzI4b2dwUUV5U2FOWTNFXC9na3oxXC9nTkdIOERiUFllc1U9IiwiYWxnIjoiUlMyNTYifQ.eyJhdF9oYXNoIjoicG13X3J3ZFBiaGNjSUFxUEhDaWJ3QSIsInN1YiI6IjA0NDgzNDk4LTIwYTEtNzBkOC00NGQ2LTlmYzJlMzFiYzMyZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9GUTFtVXZsOVMiLCJjb2duaXRvOnVzZXJuYW1lIjoiMDQ0ODM0OTgtMjBhMS03MGQ4LTQ0ZDYtOWZjMmUzMWJjMzJlIiwiYXVkIjoiMWtuMTluNGRzazNwODlvZ2xlczc1Ym52NDEiLCJldmVudF9pZCI6IjAzYTM1ZTIxLWQzY2QtNDU5Mi1iNzYyLTY5YTg4YTI2ZDJiZiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjk0OTYwMTk0LCJleHAiOjE2OTQ5NjM3OTQsImlhdCI6MTY5NDk2MDE5NCwianRpIjoiNmViZTc1OTEtNjk5MS00YjcyLWI3MTgtYTI0NTgyYjE2ODY0IiwiZW1haWwiOiJncm9uenVsQGdtYWlsLmNvbSJ9.p-nASX6qYpKOgsst4gKT7XhfkDZbeisWZ5T4hNNWcMR1uJgtuKkTr9VhsuZ_UxGlYQWaV18Q5cygYQk6xrlDUhvDno5G8yH8yK-wsiOi-ESzUgdp3eaIChDqFVa13_C2ljRgGQl6JA589kMfXYzDtI7AkJ9WZhNTVVazgvwPdyZOKlz23hI8XMi2ZfH24gyEhqGn4oiFY23QbZ_zM7AbUi3FgJnIS2TmYDhMXuv8HTM4Ua6EULwZtyPFV_LDKFXnQc5-9LPIB3d6Dzn0fhiOEIapm5xzrN8LFU24qRQkJ7NUaUlymWfngk0uDPsx_SLsTPxlXrQMiNgEkPiTObpk5g




https://dvobrjknedwre.cloudfront.net
https://gr-auth.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=1kn19n4dsk3p89ogles75bnv41&response_type=token&scope=email+openid&redirect_uri=https://dvobrjknedwre.cloudfront.net

https://gr-auth.auth.us-east-1.amazoncognito.com/logout
