# Inspirational-Quotes
  In this project, I'm exploring the Affectiva SDK. Affectiva analyzes faces by looking at the pixels at palces like the eyebrows and corners of the mouth to determine the emotions present on a face. Using the image analysis part of Affectiva, I had the user upload an image. After that, Affectiva would work its magic and list the emotions present in the face on a scale from 0 to 1 and store this information in a dictionary. I looked for the most dominant emotion (the emotion with a rating closest to 1 in the dictonary) and then displayed a quote that matches the picture. For example if the dominant emotion was fear, a quote like "The only thing we have to fear is fear itself would be displayed." 
  
  Originally for the quotes, I was going to use an API like TheySaidSo, which has a database of hundreds of thousands of quotes. But the features of the API I wanted were locked behind a subscription service, and being tight on cash I ended up scouring the internet for quotes and just hardcoding them in.
  
  Affectiva also has a camera detector for emotions, but as of writing this my webcam is busted. If I do get said webcam fixed, I don't believe coding in the functionality should be difficult, especially after figuring out how to use the image detecto in Affectiva.

Sometimes Affectiva nails it.
![Alt text](/relative/path/to/test2.jpg?raw=true "Optional Title")
![Alt text](/relative/path/to/test2After.jpg?raw=true "Optional Title")

Other times...not so much
![Alt text](/relative/path/to/test.jpg?raw=true "Optional Title")
![Alt text](/relative/path/to/testAfter.jpg?raw=true "Optional Title")
