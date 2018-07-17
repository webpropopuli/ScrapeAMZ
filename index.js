const axios = require('axios');
const cheerio = require('cheerio'); 
const fs = require('fs'); 

let searchUrl = 'https://providence.craigslist.org/d/cars-trucks/search/cta';

axios.get(searchUrl)  // load the "top level" html an parse down
	.then((response) => {
		if(response.status === 200) {
		      const html = response.data;
		      const $ = cheerio.load(html);  // this is our html block to work from
		      var itemList = [];  //this array will hold found data
      
          // find every element of this type in the html from cheerio
		      $('.result-row').each(function(i, elem) {
            let title = $(this).find('.result-title').text().trim();
			itemList[i] = {
			  title: title,
			  url: $(this).children('.result-image').attr('href'),  // from 'a href="text" class = "index-arti...."
			  //tags: $(this).find('.tags').text().split('#').map(  //this was 'div class="tags"
				  //tag => tag.trim()
        //).filter(function(n) { return n != "" }),
        price: $(this).find('.result-meta .result-price').text().trim(),
        location: $(this).find('.result-meta .result-hood').text().trim()
			}      
		      });
      
          // remove undefined elements
		      let itemListTrimmed = itemList.filter(n => n != undefined ) 
		      fs.writeFile('data/itemList.json', 
			JSON.stringify(itemListTrimmed, null, 4), (err)=>{
			console.log(itemListTrimmed);
		      })
		}
	}, (error) => console.log(error));