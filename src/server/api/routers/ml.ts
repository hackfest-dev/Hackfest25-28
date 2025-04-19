import { string, z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const mlRouter = createTRPCRouter({
    addSku: publicProcedure
    
    
    .query(async () => {
        
                fetch('http://localhost:5000')
        .then(response => {
            if (!response.ok) {
            throw new Error('Network response was not ok');
            }


            
            return response.json(); // or response.text(), response.blob(), etc.
        })
        .then(data => {
            console.log(data); // do something with the data
            return data
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            return "error"
        });


        ;
    })
});

