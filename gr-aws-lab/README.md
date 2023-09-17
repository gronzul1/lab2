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