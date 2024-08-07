import { Card } from "flowbite-react";
import React from "react";
import { useState, useEffect } from "react";

function App() {

  const [images, setImages]= useState([])

  const fetchImages = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin" : "GET"
      }

      const requestOptions = {
        method: "GET",
        mode: "cors" as RequestMode,
      var res = await fetch(
        `http://${import.meta.env.VITE_LOCAL_IPv4}:3000/images`,
        requestOptions
      );
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(()=>{
    fetchImages()
  },[])

  
  
  return (
    <>
      {
      images.map((image, index)=>
          <Card key={index} className="max-w-sm  mx-auto" imgSrc={`${import.meta.env.VITE_DATA_DIR}${image}`}>
          </Card>
        )
      }
    </>
  );
}

export default App;
