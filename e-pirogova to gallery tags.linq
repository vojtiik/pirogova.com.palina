<Query Kind="Program" />

void Main()
{
	
	var root = "http://www.e-pirogova.com";
	var page = "fashion";
	
	foreach (var file in Directory.EnumerateFiles(@"G:\Projects_Git\pirogova.com.palina\" + page, "*.jpg"))
{
   
  	var fix = file.Replace(@"G:\Projects_Git\pirogova.com.palina\"+page+ "\\","/"+page+"/");
	var imagename = fix.Replace("/"+page+"/","");
	System.Drawing.Image img = System.Drawing.Image.FromFile(file);
	//string.Format(" <div class=\"lazyImg galleryitem\" style=\"background-image:url('{0}');width: {1}px; height: {2}px\"></div>", fix, img.Width, img.Height).Dump();
  
  	
	 string.Format("<url><loc>{0}/{1}.html</loc><image:image><image:loc>{0}/{1}/{2}</image:loc></image:image><image:image><image:loc>{0}/{1}/{2}</image:loc></image:image></url>",root,page, imagename).Dump(); 
  
}


}

// Define other methods and classes here
