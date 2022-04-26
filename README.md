# server pro ukladani GIS objektu se zakladnimi atributy

GIS objekty (polygony, linie a body) stejneho vyznamu tvori vrtsvy.

## vrstva (layer)

Vrstvou muzou byt napr. body v mistech s kontenery na trideni plastu.
Dalsi vrstvou jsou napr. body v mistech s kontenery na trideni bioodpadu.
Prislusnost k nejake vrstve jednotlive body tridi do skupin.
To je dulezite pro vyhledavani.
Vrstvy se daji kombinovat v jedne mape a tvorit ruzna komplexni zobrazeni.
Rozdeleni do logicky spolu souvisejicich vrstev vektorovych bodu je zasadni.
Umoznuje vyhledavat a delat dalsi operace nad prostorovymy objekty.

## REST API

### vrstvy

- POST / - vytvori novou vrstvu
- PUT /:id - upravy vrstvu s danym _ID_
- GET /:id - vrati info o vrstve s danum _ID_
- GET / - vrati info o vrstvach podle URL params

### objekty

- POST /objs/:layerID/ - vytvori novy objekt ve vrstve s danym _layerID_
- PUT /objs/:layerID/:objID - edituje objekt s danym ID v dane vrstve
- DELETE /objs/:layerID/:objID - dtto operace smazani

## DB

Pro ukladani vektoru je pouzit PostGIS jako nejsofistikovanejsi otevrena DB.
DB schema ma 2 tabulky:
- vrstvy [layers](migrations/20190803_layers.js)
- objekty [objects](migrations/20191223_objects.js)

## konfigurace

Pomocí env.vars:
- PORT: port na ktere app pobezi
- USE_CORS: true jestli app pobezi na extra url a bude treba CORS
- DATABASE_URL: connection string do databaze
- NODE_ENV: viz. [clanek](https://dzone.com/articles/what-you-should-know-about-node-env)
- SHARED_SECRET: string_for_securing_JWT_tokens

Idelani pouzit Dockerfile a app ovladat pres docker-compose:

```
  open-js-geo-server:
    build: ./repos/open-js-geo-server
    image: open-js-geo-server
    network_mode: host
    container_name: open-js-geo-server
    environment:
      - PORT=3000
      - DATABASE_URL=postgres://username:secret@localhost:5432/moje_db
      - SHARED_SECRET=string_for_securing_JWT_tokens
```

## testování

### token pomoci testovaciho auth

Nejprve ziskejte token pomoci testovaciho auth https://testauth22.herokuapp.com/.
Environment variable SHARED_SECRET musite ale nastavit na: verysecretphrase.
```
SHARED_SECRET=verysecretphrase
```

Pokus muze vypadat takto:

```
LOGINDATA='{"uname":"pokus1","passwd":"*"}'
TOKEN=`curl -X POST https://testauth22.herokuapp.com/success/ \
  -d $LOGINDATA -H "Content-Type: application/json"`

DATA='{"title":"pokus1","writers":"*","owner":"11"}'
wget -O- --post-data $DATA \
  --header='Content-Type:application/json' \
  --header="Authorization: Bearer $TOKEN" http://localhost:3001/layers

wget -O- http://localhost:3001/layers | json_pp
```

## zajimavosti

- http://turfjs.org

```
eval $(minikube -p minikube docker-env)
docker build . -f dev/Dockerfile -t modularniurad/gis
kubectl apply -f dev/pod.yaml
```

kubectl port-forward gis 9229:9229

# DB

list avail extensions:
select * from pg_available_extensions where Name like 'postgis%';

install postgis
CREATE EXTENSION postgis;