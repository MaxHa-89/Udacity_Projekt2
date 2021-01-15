import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import fs from 'fs';
import path from 'path';


// Zeile 1-3 stellt notwendig Nodepackages zur Verfügung.

(async () => {
//Start des Programms, async=Server kann mehrere Anfragen gleichzeitig bearbeiten

  // Init the Express application, betrieb der eigentlichen App
  const app = express();



  // Set the network port Adresse des ganzen Servers, Adresse server running http://localhost:8082, Endpoint ist genauer
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */



  //! END @TODO1

  // Root Endpoint über http://localhost:8082 -> ist nur der Server, Server bestimmt auch die Logik der Abrufe, ganze Logik im Server konfiguriert
  // Displays a simple message to the user
  // app. ist die Anwendung, "/" Endpoint der erreicht wird wenn nicht genauer über URL definiert

  app.get( "/", async ( req:Request, res:Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredimage", ( req:Request, res:Response ) => {
    const {image_url}: {image_url: string}= req.query;
    console.log (image_url);
    let filteredImage = filterImageFromURL(image_url).catch(error=>{
      res.status(422).send('image could not be filtered');
      
    });

    filteredImage.then( (imagePath :string | void) =>{
      console.log(imagePath);
      console.log('try send ' + imagePath);
      if (!imagePath) { 
        return res.status(422).send('image could not be filtered');
      }
        
      res.status(200).sendFile(imagePath, function (err){
        if (err) {
        res.status(422).send('image could not be filtered');
        
        } else {
        deleteLocalFiles([imagePath]);  
        }
        
      });
      }
    )
  } );
  // send image URL -> Die Adresse des Bild das angezeigt werden soll, wird festgelegt, in dem bsp https://i0.wp.com/www.mobiflip.de/wp-content/uploads/2020/03/audi-e-tron-gt-front-header.jpg?w=1200&ssl=1

  // http://localhost:8082/filteredimage/:image_url, Adresse, Ziel: Definition einer Server URl von nem Bild



  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
