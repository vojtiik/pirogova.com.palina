<Query Kind="Program" />

void Main()
{
	
	var root = "http://www.e-pirogova.com";
	var page = "fashion";
	var sitemapImages = new List<string>();
	var pageImages  = new List<string>();
	var imagebankImages  = new List<string>();
	
foreach (var file in Directory.EnumerateFiles(@"G:\Projects_Git\pirogova.com.palina\" + page, "*.jpg"))
{   
  	var fix = file.Replace(@"G:\Projects_Git\pirogova.com.palina\"+page+ "\\","/"+page+"/");
	var imagename = fix.Replace("/"+page+"/","");
	System.Drawing.Image img = System.Drawing.Image.FromFile(file);
	
	pageImages.Add(string.Format("<a target=_blank href=\"{0}\"><div class=\"lazyImg galleryitem\" style=\"background-image:url('{0}');width: {1}px; height: {2}px\"></div></a>", fix, img.Width, img.Height));
    imagebankImages.Add(string.Format("<a target=_blank href=\"{0}\"><img src=\"{0}\" alt=\"{3}\" height=\"{2}\" width=\"{1}\"/>{3}</a>", fix, img.Width, img.Height,imagename.Replace(".jpg","") ));
  	sitemapImages.Add(string.Format("<image:image><image:loc>{0}/{1}/{2}</image:loc><image:title>{3}</image:title></image:image>",root,page, imagename,imagename.Replace(".jpg","")));
	
}

DumpSitemap(root +"/"+ page, sitemapImages);
DumpSitemap(root +"/imagestore", sitemapImages);

pageImages.Dump();
imagebankImages.Dump();
}

public void DumpSitemap(string page, List<string> images)
{
 string.Format("<url><loc>{0}.html</loc>", page).Dump();
   "<lastmod>2015-05-20</lastmod><changefreq>weekly</changefreq><priority>0.8</priority>".Dump();

foreach(var s in images)
{
s.Dump();
}
"</url>".Dump();
}




// Define other methods and classes here