var TheHeadLines = new Array();

//May become deprecated
var IsThreeRows = undefined;
var Nperrow = 4;
var LeContentObjectID = "LeContent";
var LeArticleObjectID = "LeArticle";
var LeArticleContainerObjectID = "LeArticleContainer";
var FooterObjectID = "TheFooter";
var FooterBottomPosition = 98;
var BillboardTimer = undefined;

//For Headline function
var HeadLineSwitch = false;

//New Variables
NavLocation = "resources.json";
Sitemap = undefined;
MasterPageMap = undefined;
var IsMobile = false;
MasterMobilePageLoaded = null;

//For the scrolling
didScroll = false;
ScrollRefPoint = null;
lastScrollY = 0;
pageheight = undefined;
HashNavUnlocked = false;

//For the spotlights
var IsSeeingPhotos = false;

MusicAlbumCount = 0;
PicturesCursor = 0;

//May become deprecated
function SetUIVariables()
{
	if(IsMobile)
	{
		Nperrow = 1;
		LeContentObjectID = "Mobile-LeContent";
		FooterObjectID = "Mobile-Footer";
	}
}

var TheGrid = new Object();

function OnLoad()
{
	CheckCompatibility();
	imageMapResize();
	SetUIVariables();
	//Now we'll have to load from external JSON
	/*LoadResources();
	PutInGrid();
	OnResize();*/
	
	//Let's do just that
	//LoadPage(NavLocation);
	//iOS Safari 10 from ignoring the user-scalable=no.
	/*document.body.addEventListener("touchmove", function(event) {
		//window.scroll(0, window.scrollY);
		//if(event.scale != 1) {
		//	event.preventDefault();
		//}
	},false);*/
	//Check if it's mobile!!
	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
		IsMobile = true;
	}
	GetMasterPage().then(GoHash);
	GetSitemap();
	//document.getElementById("ModalView").style.display = "none";
	setTimeout(OnResizeChangePage, 500);
	setInterval(OnResize, 1000);
}

function CheckCompatibility() {
	var compatible = true;
	if(!compatible) {
		document.getElementById("Compatibility-Notice").style.pointerEvents = "auto";
		document.getElementById("Compatibility-Notice").style.opacity = "1";
	}
}

function HeadLine(imgsrc, msg, url, type, appendWhere, SubHeadLine, ContentList)
{
	if(appendWhere == undefined) {
		appendWhere = document.getElementById(LeContentObjectID);
	}
	if(SubHeadLine == undefined) {
		SubHeadLine = TheHeadLines[0];
	}
	if(ContentList == undefined) {
		ContentList = SubHeadLine;
	}
	var that = this;
	this.imgsrc = imgsrc;
	this.msg = msg;
	this.url = url;
	this.type = type;
	this.Position = SubHeadLine.length;
	this.ContentList = ContentList;

	this.Obj = document.createElement("div");

	if(this.type == undefined)
	{
		this.type = 0;
	}

	if(this.type == 0)
	{
		this.Obj.onclick = function() {
			
			var TriggerSlideShow = new Promise(function(resolve, reject) {
				OpenLoadingModal();
				var items = new Array();
				var imagesloaded = 0;
				var totalimages = 0;
				for(var i=0;i < that.ContentList.length; i++) {
					var TheType = that.ContentList[i].type || that.ContentList[i].Type;
					if(TheType == 0 || TheType == "Picture") {
						totalimages++;
						(new Promise(function(resolve, reject) {
							var TheImage = new Image();
							TheImage.src = that.ContentList[i].url || that.ContentList[i].Picture;
							//Poll many times for size until we have it. Once we do, delete image.
							var poll = setInterval(function() {
								if(TheImage.naturalWidth) {
									clearInterval(poll);
									items[imagesloaded] = {
										src: TheImage.src,
										w: TheImage.naturalWidth,
										h: TheImage.naturalHeight
									};
									TheImage = null;
									imagesloaded++;
									if(imagesloaded >= totalimages) {
										resolve(items);
									}										
								}
							}, 10);
						})).then(resolve).catch(reject);
					}
				}
			});
			TriggerSlideShow.then(function(result) {
				console.log(that.Position);
				console.log(SubHeadLine);
				var options = {
					index: that.Position
				};
				var gallery = new PhotoSwipe( document.getElementById("PhotoSwipeSS"), PhotoSwipeUI_Default, result, options);
				gallery.init();
				CloseLoadingModal();
			});
			//PicturesCursor = that.Position;
			//ModalUpdateButtons();
			//OpenModal(that.url, that.msg);
		}
		IsSeeingPhotos = true;
	}
	
	if(this.type == 2)
	{
		this.Obj.onclick = function() {
			//OpenMusicModal(that.url);
			GetJSON(that.url.PlaylistURL).then(function(response) {
				LoadMusicBar(response, that.url.SongNumber);
				PlayPauseSong();
			});
		}
	}


	if(this.type == 1 || this.type == 3 || this.type == 4 || this.type == 5 || this.type == 9)
	{
		this.Obj.onclick = function() {
			GoToURL(that.url);
		}
	}
	
	//Billboard
	if(this.type == 8) {
		this.Pics = new Array();
		this.PicsMobile = new Array();
		
		for(var i = 0;i < imgsrc.Pictures.length;i++) {
			this.Pics[i] = document.createElement("img");
			this.Pics[i].src = imgsrc.Pictures[i];
			this.Pics[i].className = "billboardpic";
			document.getElementById("BillboardContent").appendChild(this.Pics[i]);
			
			this.PicsMobile[i] = document.createElement("img");
			this.PicsMobile[i].src = imgsrc.PicturesSmall[i];
			this.PicsMobile[i].className = "billboardpic";
			document.getElementById("BillboardContentMobile").appendChild(this.PicsMobile[i]);
		}
		
		this.Slider = new IdealImageSlider.Slider('#BillboardContent', "BillboardContent");
		this.Slider.addBulletNav();
		this.Slider.start();
		
		this.SliderMobile = new IdealImageSlider.Slider('#BillboardContentMobile', "BillboardContentMobile");
		this.SliderMobile.addBulletNav();
		this.SliderMobile.start();
				
		/*this.Pictures = this.imgsrc.Pictures;
		this.urls = this.url;
		
		this.Pic = document.createElement("div");
		this.Pic.className = "billboardpic";
		this.Pic.style.background = "url(" + this.url + ")";
		this.Pic.style.backgroundSize = "cover";
		this.Pic.style.backgroundRepeat = "no-repeat";
		this.Pic.style.backgroundPosition = "center top";
		this.Obj.appendChild(this.Pic);
		
		this.ButtonBck = document.createElement("img");
		this.ButtonFwd = document.createElement("img");
		this.ButtonBck.className = "BillboardButtonBck";
		this.ButtonFwd.className = "BillboardButtonFwd";
		this.ButtonFwd.src = "index_resources/GoFwd.png";
		this.ButtonBck.src = "index_resources/GoBack.png";
		this.Obj.appendChild(this.ButtonBck);
		this.Obj.appendChild(this.ButtonFwd);
		this.ButtonBck.onclick = function() {
			that.Cursor++;
			that.Cursor = that.Cursor%that.Pictures.length;
			that.Pic.style.backgroundSize = "cover";
			that.Pic.style.backgroundRepeat = "no-repeat";
			that.Pic.style.backgroundPosition = "center top";
			that.Frame.onclick = function() {
				window.open(that.urls[that.Cursor]);
			}
		}
		
		this.ButtonBck.onclick = function() {
			that.Cursor--;
			that.Cursor = that.Cursor%that.Pictures.length;
			that.Pic.style.background = "url(" + that.Pictures[that.Cursor] + ")";
			that.Pic.style.backgroundSize = "cover";
			that.Pic.style.backgroundRepeat = "no-repeat";
			that.Pic.style.backgroundPosition = "center top";
			that.Frame.onclick = function() {
				window.open(that.urls[that.Cursor]);
			}
		}

		
		//Will be deprecated after resizable billboard is done.
		/*this.Frame = document.createElement("img");
		this.Frame.draggable = false;
		this.Frame.src = "index_resources/Frame billboard.png";
		this.Frame.className = "BillboardFrame";
		this.Obj.appendChild(this.Frame);
		PUT THE END COMMENT THING HERE
		this.Cursor = 0;
		
		BillboardTimer = setInterval(function() {
			that.Cursor++;
			that.Cursor = that.Cursor%that.Pictures.length;
			that.Pic.style.background = "url(" + that.Pictures[that.Cursor] + ")";
			that.Pic.style.backgroundSize = "cover";
			that.Pic.style.backgroundRepeat = "no-repeat";
			that.Pic.style.backgroundPosition = "center center";
			/*that.Frame.onclick = function() {
				window.open(that.urls[that.Cursor]);
			}
			PUT THE END COMMENT THING HERE
		}, 5000);
		
		
		var OriginalFunc = OnResize;
		OnResize = function() {
			if(window.innerWidth < 640) {
				that.Pictures = that.imgsrc.PicturesSmall;
			}
			else {
				that.Pictures = that.imgsrc.Pictures;
			}
			return OriginalFunc();
		}*/
		
		
		return true;
	}
	
	appendWhere.appendChild(this.Obj);
	
	if(this.type == 6) {
		var TheElements = imgsrc;
		
		//Set the Flex Container properties to the this.Obj
		this.Obj.className = "MusicAlbumsContainer";
		this.Elements = new Array()
		
		for(var i=0;i<imgsrc.length;i++) {
			var TheElement = imgsrc[i];
			this.Elements[i] = document.createElement("div");
			this.Obj.appendChild(this.Elements[i]);
			this.Elements[i].className = "MusicAlbumOnContainer";
			this.Elements[i].style.background = "url(" + TheElement.Thumbnail + ")";
			this.Elements[i].style.backgroundSize = "cover";
			this.Elements[i].style.backgroundRepeat = "no-repeat";
			this.Elements[i].style.backgroundPosition = "center center";
			this.Elements[i].onclick = function() {
				location.href = TheElement.URL;
			}
		}
		return true;
	}
	
	if(this.type == 7) {
		MusicAlbumCount++;
		this.Obj.className = "MusicAlbumContainer";
		if(MusicAlbumCount%2 == 1) {
			this.Obj.style.flexDirection = "row-reverse";
		}
		this.Thumbnail = document.createElement("div");
		this.Thumbnail.className = "MusicAlbumThumbnail";
		this.Thumbnail.style.background = "url('" + imgsrc + "')";
		this.Thumbnail.style.backgroundSize = "cover";
		this.Thumbnail.style.backgroundRepeat = "no-repeat";
		this.Thumbnail.style.backgroundPosition = "center center";
		this.Obj.appendChild(this.Thumbnail);
		
		this.Playlist = document.createElement("table");
		this.Playlist.className = "MusicAlbumTable";
		this.Obj.appendChild(this.Playlist);
		this.PlaylistSongs = new Array();
		
		GetJSON(url).then((function(response) {
			that.MusicLibrary = response;
			that.AreWeLoaded = false;
			
			for(var i=0;i<that.MusicLibrary.length;i++) {
				var ThisTR = document.createElement("tr");
				that.Playlist.appendChild(ThisTR);
				ThisTR.className = "MusicAlbumTr";
				
				var PlayTD = document.createElement("td");
				PlayTD.className = "MusicAlbumPlayTD";
				ThisTR.appendChild(PlayTD);
				var PlayPauseLabel = document.createElement("i");
				PlayPauseLabel.className = "fa fa-play";
				PlayTD.appendChild(PlayPauseLabel);
				
				var NameTD = document.createElement("td");
				NameTD.className = "MusicAlbumTd";
				ThisTR.appendChild(NameTD);
				NameTD.innerText = that.MusicLibrary[i].Name;
				that.PlaylistSongs.push({TR: ThisTR, Status: PlayPauseLabel});
				//Make listeners to when you click those things
				ThisTR.onclick = (function() {
					if(that.AreWeLoaded) {
						if(MBNameObj.innerText == MusicLibrary[this.Index].Name) {
							PlayPauseSong();
							return;
						}
						SelectSong(this.Index);
						if(!IsPlaying) {
							PlayPauseSong();
						}
					}
					else {
						LoadMusicBar(that.MusicLibrary, this.Index, that.UnloadHandler);
						if(!IsPlaying) {
							PlayPauseSong();
						}
						that.AreWeLoaded = true;
					}
				}).bind({Index: i});
				if(that.MusicLibrary[i].LyricsURL && that.MusicLibrary[i].LyricsURL != "") {
					var LyricsTD = document.createElement("td");
					LyricsTD.className = "MusicAlbumTd";
					ThisTR.appendChild(LyricsTD);
					var LyricsSpan = document.createElement("span");
					LyricsTD.appendChild(LyricsSpan);
					LyricsSpan.classList.add("fa");
					LyricsSpan.classList.add("fa-book");
					LyricsTD.classList.add("LyricsTD");
					LyricsTD.onclick = (function() {
						location.href = this.LyricsURL;
					}).bind({LyricsURL: that.MusicLibrary[i].LyricsURL});
				
					ThisTR.onmouseover = (function() {
						this.LyricsTD.classList.add("LyricsTDHover");
					}).bind({LyricsTD: LyricsTD});
				
					ThisTR.onmouseout = (function() {
						this.LyricsTD.classList.remove("LyricsTDHover");
					}).bind({LyricsTD: LyricsTD});
				}
			}
			
			that.UnloadHandler = function() {
				that.AreWeLoaded = false;
			}
						
			that.UpdateLook = function() {
				for(var i=0;i<that.PlaylistSongs.length;i++) {
					that.PlaylistSongs[i].TR.className = "MusicAlbumTr";
					that.PlaylistSongs[i].Status.className = "fa fa-play";
				}
				if(that.AreWeLoaded) {
					that.PlaylistSongs[SongCursor].TR.className = "MusicAlbumTrSelected";
					if(IsPlaying) {
						that.PlaylistSongs[SongCursor].Status.className = "fa fa-pause";
					}
				}
			}
			
			setInterval(that.UpdateLook ,250);
			
		}).bind(this));
		return true;
	}
	
	
	this.Pic = document.createElement("div");
	this.Pic.className = "contentpic";
	this.Pic.style.background = "url(" + this.imgsrc + ")";
	this.Pic.style.backgroundSize = "cover";
	this.Pic.style.backgroundRepeat = "no-repeat";
	this.Pic.style.backgroundPosition = "center top";
	this.Obj.appendChild(this.Pic);

	this.Frame = document.createElement("img");
	this.Frame.draggable = false;
	this.Obj.appendChild(this.Frame);

	this.Label = document.createElement("div");
	this.LabelInside = document.createElement("p");
	this.LabelInside.style.alignSelf = "center";
	this.LabelInside.innerHTML = this.msg;
	this.Obj.appendChild(this.Label);
	this.Label.appendChild(this.LabelInside);
	this.LabelMask = document.createElement("div");
	this.LabelMask.className = "ContentLabelMask";
	this.Obj.appendChild(this.LabelMask);
	this.Obj.onmouseover = function() {
		that.Label.style.opacity = 1;
		that.LabelMask.style.opacity = 0.6;
		that.Label.style.transform = "scale(1)";
	}
	
	this.Obj.onmouseout = function() {
		that.Label.style.opacity = 0;
		that.LabelMask.style.opacity = 0;
		that.Label.style.transform = "scale(1.2)";
	}


	if(this.type == 3)
	{
		this.Frame.src = "index_resources/postit.png";
		this.Frame.className = "PostItframe";
		this.Obj.className = "PieceOfContentPostIt";
		this.Label.className = "contentlabelPostIt";
	}
	else if(this.type == 5)
	{
		this.Frame.src = "index_resources/frame.png";
		this.Frame.className = "contentframe";
		this.Obj.className = "PieceOfContentPolaroid";
		this.Label.className = "contentlabelPolaroid";
		IsSeeingPhotos = true;
	}
	else if(this.type == 9)
	{
		//VideoLink
		this.Frame.src = "index_resources/VideoFrame.png";
		this.Frame.className = "videocontentframe";
		this.Obj.className = "PieceOfContentVideo";
		this.Label.className = "contentlabelVideo";
		this.Pic.className = "videocontentpic";
		this.LabelMask.className = "ContentLabelMaskVideo";
	}
	else
	{
		this.Frame.src = "index_resources/frame.png";
		this.Frame.className = "contentframe";
		this.Obj.className = "PieceOfContentPolaroid";
		this.Label.className = "contentlabelPolaroid";
	}
	

	if(this.type == 4) {
		HeadLineSwitch = !HeadLineSwitch;
		
		this.UpperObj = document.createElement("div");
		appendWhere.appendChild(this.UpperObj);
		this.UpperObj.className = "PolaroidTextObj";
		this.UpperObj.appendChild(this.Obj);
		
		this.SideText = document.createElement("div");
		this.UpperObj.appendChild(this.SideText);
		this.SideText.className = "PolaroidSideText";
		
		//next line will undo what we have done earlier this function
		this.Label.innerHTML = "";
		
		this.SideTextH1 = document.createElement("h1");
		this.SideTextH1.innerHTML = this.msg.Title;
		this.SideText.appendChild(this.SideTextH1);
		
		this.SideTextHR = document.createElement("hr");
		this.SideText.appendChild(this.SideTextHR);
		
		this.SideTextP = document.createElement("p");
		this.SideTextP.innerHTML = this.msg.Message;
		this.SideText.appendChild(this.SideTextP);
		
		this.SideTextButton = document.createElement("button");
		this.SideTextP.appendChild(this.SideTextButton);
		this.SideTextButton.innerText = "Read More";
		this.SideTextButton.onclick = function() {
			location.href = that.url;
		}
		
		if(HeadLineSwitch) {
			this.SideText.style.order = "1";
			this.Obj.style.order = "2";
		}
	}
	
	return true;
}


//Grid might be different from now on.

function PutInGrid()
{
	TheGrid.table = document.createElement("table");
	TheGrid.table.style.width = "100%";

	document.getElementById(LeContentObjectID).appendChild(TheGrid.table);

	TheGrid.rows = new Array();
	TheGrid.cells = new Array();
	for(i=0;i<Math.ceil(SubHeadLine.length/Nperrow);i++)
	{
		TheGrid.rows[i] = document.createElement("tr");
		TheGrid.table.appendChild(TheGrid.rows[i]);
		TheGrid.cells[i] = new Array();

		for(j=0;j<Nperrow;j++)
		{

			TheGrid.cells[i][j] = document.createElement("td");
			TheGrid.rows[i].appendChild(TheGrid.cells[i][j]);
			if((i*Nperrow + j) < SubHeadLine.length)
			{
						TheGrid.cells[i][j].appendChild(SubHeadLine[i*Nperrow + j].Obj);
			}
		}
	}
}

//Might become deprecated
function OnResize()
{
	pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
    //document.getElementById(FooterObjectID).style.top = pageheight - FooterBottomPosition;
    document.getElementById("backgroundbottom").style.height = pageheight - 613;
    //FitModalImageToBoudingBox();
}

function OnResizeChangePage()
{
    //document.getElementById(FooterObjectID).style.top = 0;
	OnResize();
}

function OnScroll()
{
	didScroll = true;
}

setInterval(function() {
	UpdateScrollHashValue();
	if(didScroll && ScrollRefPoint == null) {
		ScrollRefPoint = lastScrollY;
	}
	else if(didScroll) {
		lastScrollY = window.scrollY;
		var ScrollDelta = window.scrollY - ScrollRefPoint;
		if(window.scrollY >= 250) {
			if(ScrollDelta >= 50) {
				//Hide menu
				/*document.getElementById("BackMenu").classList.add("NavUp");
				document.getElementById("Title").classList.add("NavUp");
				document.getElementById("CompactTitle").classList.add("NavUp");
				document.getElementById("WNCH").classList.add("NavUp");
				document.getElementById("NeonLL").classList.add("NavUp");
				document.getElementById("NeonRR").classList.add("NavUp");
				document.getElementById("DropDownMenu").classList.add("NavUp");
				*/
				//show ScrollDownMenu
				document.getElementById("ScrollDownMenu").style.top = 0;				
				CloseDropDownMenu();
				HideSpotlights();
				didScroll = false;
				ScrollRefPoint = null;
			}
			if(ScrollDelta <= -50) {
				//show menu
				didScroll = false;
				ScrollRefPoint = null;
			}
		}
		else if(window.scrollY >= 120) {
					HideSpotlights();
					didScroll = false;
					ScrollRefPoint = null;
		}
		else {
			//Restart spotlight
			if(IsSeeingPhotos) {
				RestartSpotlights();
			}
			didScroll = false;
			ScrollRefPoint = null;
		}
		if(parseInt(document.getElementById("ScrollDownMenu").style.top) == 0 && window.scrollY <= 250) {
			//hide ScrollDownMenu
			document.getElementById("ScrollDownMenu").style.top = -100;			
		}
	}
}, 500);

var SpotlightLock = false;

function HideSpotlights() {
		SpotlightLock = true;
		document.getElementById("backgroundall").style.opacity = 0.8;	
		setTimeout(function() {
			document.getElementById("backgroundtop").style.opacity = 0;
			document.getElementById("backgroundcenter").style.opacity = 0;
			document.getElementById("backgroundbottom").style.opacity = 0;
				setTimeout(function() {
					document.getElementById("backgroundbottom").style.display = "none";
					SpotlightLock = false;
				}, 500);
		}, 100);
}

function RestartSpotlights() {
		if(SpotlightLock) {
			return false;
		}
		document.getElementById("backgroundtop").style.opacity = 0.8;
		document.getElementById("backgroundcenter").style.opacity = 0.8;
		document.getElementById("backgroundbottom").style.display = "block";
		document.getElementById("backgroundbottom").style.opacity = 0.8;
		setTimeout(function() {
			document.getElementById("backgroundall").style.opacity = 0;
		}, 100);
}

//Might become deprecated
function SwitchToThreePerRow()
{
	document.getElementById(LeContentObjectID).style.left = "Calc(50% - 500px)";
	document.getElementById(LeContentObjectID).style.width = "1000px";
	//document.getElementById("backgroundcenter").style.backgroundPosition = "center";
	IsThreeRows = true;
}

//Might become deprecated
function SwitchToTwoPerRow()
{
	document.getElementById(LeContentObjectID).style.left = "Calc(50% - 332px)";
	document.getElementById(LeContentObjectID).style.width = "664px";
	//document.getElementById("backgroundcenter").style.backgroundPosition = "Calc(50% - 166px)";
	IsThreeRows = false;
}

//DropDown Menu

function ShowDropDownMenu() {
	document.getElementById("DropDownMenu").style.maxHeight = "200px";
	document.getElementById("DropDownModal").classList.add("DropDownModalOn");
}

function CloseDropDownMenu() {
	document.getElementById("DropDownMenu").style.maxHeight = "0px";
	document.getElementById("DropDownModal").style.display = "none";
	document.getElementById("DropDownModal").classList.remove("DropDownModalOn");
}

//Modal functions

function CloseLoadingModal()
{
	document.body.classList.remove("ModalOpen");
	document.getElementById("ModalView").style.display = "none";
	document.getElementById("LoadingSpinner").style.display = "none";
}

function OpenLoadingModal()
{
	document.body.classList.add("ModalOpen");
	document.getElementById("ModalView").style.display = "flex";
	document.getElementById("LoadingSpinner").style.display = "block";
}

//Mobile specific

function OpenCompactMenu()
{
	document.body.classList.add("ModalOpen");
	document.getElementById("CompactMenuDrawer").className = "DrawerOpen";
	document.getElementById("CompactMenuModal").className = "";
}

function CloseCompactMenu()
{
	document.body.classList.remove("ModalOpen");
	document.getElementById("CompactMenuDrawer").className = "DrawerClosed";
	document.getElementById("CompactMenuModal").className = "pseudo-hidden";
}

function MenuCursorMove(xA, yA, xF, yF) {
	var y0 = 213;
	document.getElementById("MenuCursor").style.left = "calc(50% - 400px + " + xA + "px)";
	document.getElementById("MenuCursor").style.top = yA + y0;
	document.getElementById("MenuCursor").style.height = yF - yA;
	document.getElementById("MenuCursor").style.width = xF - xA;
	document.getElementById("MenuCursor").style.opacity = 1;
}

function MenuCursorHide() {
	document.getElementById("MenuCursor").style.opacity = 0;
}


function DrawerGo(towhere)
{
	GoToURL(towhere);
	location.href = towhere;
	CloseCompactMenu();
}

//Multi-page navigation

function GoToURL(towhere)
{
	if(towhere.substring(0,1) == "#")
	{
		location.href = towhere;
	}
	else
	{
			/*var form = document.createElement("form");
			form.method = "GET";
			form.action = towhere;
			form.target = "_blank";
			document.body.appendChild(form);
			form.submit();*/
			window.open(towhere);
	}
}

function LoadArticle(ArticleHTML) {
	ClearPage();
	document.getElementById(LeArticleObjectID).innerHTML = ArticleHTML;
	document.getElementById(LeArticleContainerObjectID).style.display = "block";
	OnResize();
}

function GetJSON(url) {
	return new Promise(function(resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function() {
			if(req.status == 200) {
				resolve(JSON.parse(req.response));
			}
			else {
				reject(Error(req.statusText));
			}
		}
		req.onerror = function() {
			reject(Error("Network Error"));
		}
		req.send();
	});
}

function LoadMasterMobilePage() {
	return new Promise(function(resolve, reject) {
		ClearPage(true);
		HideSpotlights();
		UpdatePageTitle("Corbin Hale");
		MasterPageMap.map(function(item, MapIndex) {
			TheHeadLines[MapIndex] = new Array();
			GetJSON(item.address).then(function(response) {
				if(item.title != "") {
					var ThisSectionDiv = document.createElement("div");
					ThisSectionDiv.className = "MasterPageSection";
					document.getElementById(LeContentObjectID).appendChild(ThisSectionDiv);
					var ThisTitleDiv = document.createElement("div");
					var ThisTitle = document.createElement("h1");
					var ThisHR = document.createElement("hr");
					ThisTitleDiv.appendChild(ThisTitle);
					ThisTitleDiv.appendChild(ThisHR);
					ThisTitleDiv.className = "MasterPageHeader";
					ThisHR.className = "Master-Page-Header-HR";
					ThisSectionDiv.appendChild(ThisTitleDiv);
					ThisTitle.innerText = item.title;
					MasterPageMap[MapIndex].TitleObj = ThisTitleDiv;
					MasterPageMap[MapIndex].SectionDiv = ThisSectionDiv;
					MasterPageMap[MapIndex].ElementsLoaded = 0;
					MasterPageMap[MapIndex].Elements = response;	
				}
				else {
					//Experimental
					MasterPageMap[MapIndex].TitleObj = document.getElementById("LeMenu");
					MasterPageMap[MapIndex].SectionDiv = document.getElementById("BillboardContainer");
					MasterPageMap[MapIndex].ElementsLoaded = 0;
					MasterPageMap[MapIndex].Elements = response;	
				}
				var MaxElements = undefined;
				if(item.maxelements) {
					MaxElements = item.maxelements;
				}
				var AddToSection = function(item) {
					switch(item.Type)
					{
						case "Picture":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, item.Caption, item.Picture, 0, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex], MasterPageMap[MapIndex].Elements));
							break;
						case "PolaroidLink":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 1, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "PolaroidMusic":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, item.Caption, {PlaylistURL: item.PlaylistURL, SongNumber: item.SongNumber}, 2, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "PostIt":
							TheHeadLines[MapIndex].push(new HeadLine("", item.Caption, item.URL, 3, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "PolaroidText":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, {Title: item.CaptionTitle, Message: item.Caption}, item.URL, 4, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "PolaroidAlbum":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 5, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "MusicAlbums":
							TheHeadLines[MapIndex].push(new HeadLine(item.Elements, undefined, undefined, 6, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;				
						case "MusicAlbum":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, undefined, item.PlaylistURL, 7, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "Billboard":
							var AllPics = new Object();
							AllPics.Pictures = item.Pictures;
							AllPics.PicturesSmall = item.PicturesSmall;
							document.getElementById("BillboardContainer").style.display = "block";
							TheHeadLines[MapIndex].push(new HeadLine(AllPics, undefined, item.urls, 8, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
						case "VideoLink":
							TheHeadLines[MapIndex].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 9, MasterPageMap[MapIndex].SectionDiv, TheHeadLines[MapIndex]));
							break;
					}
				}
				response.map(function(ThisItem, index) {
					if(MaxElements) {
						if(index == MaxElements-1) {
							var SeeMoreButton = document.createElement("button");
							SeeMoreButton.className = "LoadMoreButton";
							MasterPageMap[MapIndex].SectionDiv.appendChild(SeeMoreButton);
							SeeMoreButton.innerText = "Load More…";
							SeeMoreButton.onclick = function() {
								MasterPageMap[MapIndex].SectionDiv.removeChild(SeeMoreButton);
								for(var i=0;i < Math.min(MaxElements, response.length - MasterPageMap[MapIndex].ElementsLoaded);i++) {
									AddToSection(MasterPageMap[MapIndex].Elements[MasterPageMap[MapIndex].ElementsLoaded+i]);
								}
								MasterPageMap[MapIndex].ElementsLoaded += i;
								if(MasterPageMap[MapIndex].ElementsLoaded < MasterPageMap[MapIndex].Elements.length) {
									MasterPageMap[MapIndex].SectionDiv.appendChild(SeeMoreButton);
								}
							}
							return;
						}
						else if(index >= MaxElements) {
							//Skip
							return;
						}
						else {
							//Keep going
							MasterPageMap[MapIndex].ElementsLoaded += 1;
						}
					}
					AddToSection(ThisItem);
					IsSeeingPhotos = false;
					MasterMobilePageLoaded = true;
					if(MapIndex == MasterPageMap.length -1) {
						resolve();
					}
				});
			});
		});
		HideSpotlights();
		OnResize();
	});
}

function LoadPage(url) {
	//document.getElementById(FooterObjectID).style.top = -101;
	NavLocation = url;
	ClearPage();
	TheHeadLines[0] = new Array();
	GetJSON(NavLocation).then(function(response) {
		response.map(function(item, index) {
			switch(item.Type)
			{
				case "Article":
					LoadArticle(item.HTML);
					break;
				case "Picture":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, item.Caption, item.Picture, 0));
					break;
				case "PolaroidLink":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 1));
					break;
				case "PolaroidMusic":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, item.Caption, {PlaylistURL: item.PlaylistURL, SongNumber: item.SongNumber}, 2));
					break;
				case "PostIt":
					TheHeadLines[0].push(new HeadLine("", item.Caption, item.URL, 3));
					break;
				case "PolaroidText":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, {Title: item.CaptionTitle, Message: item.Caption}, item.URL, 4));
					break;
				case "PolaroidAlbum":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 5));
					break;
				case "MusicAlbums":
					TheHeadLines[0].push(new HeadLine(item.Elements, undefined, undefined, 6));
					break;				
				case "MusicAlbum":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, undefined, item.PlaylistURL, 7));
					break;
				case "Billboard":
					var AllPics = new Object();
					AllPics.Pictures = item.Pictures;
					AllPics.PicturesSmall = item.PicturesSmall;
					document.getElementById("LeContent").style.display = "none";
					document.getElementById("BillboardContainer").style.display = "block";
					TheHeadLines[0].push(new HeadLine(AllPics, undefined, item.urls, 8));
					break;
				case "VideoLink":
					TheHeadLines[0].push(new HeadLine(item.Thumbnail, item.Caption, item.URL, 9, MasterPageMap[MapIndex].SectionDiv));
					break;
			}
		});
		//Update the footer
		OnResize();
		if(IsSeeingPhotos) {
			RestartSpotlights();
		}
		else {
			HideSpotlights();
		}
	})
	/*.catch(function(response) {
		console.log("Failed to open page." + response);
	});*/
}

function ClearPage(WillLoadMasterPageAfter) {
	TheHeadLines = null;
	TheHeadLines = new Array();
	Pictures = null;
	Pictures = new Array();
	if(MasterMobilePageLoaded) {
		for(var i=0;i < MasterPageMap.length;i++) {
			MasterPageMap[i].TitleObj = null;
		}
	}
	if(WillLoadMasterPageAfter != true) {
		MasterMobilePageLoaded = false;
	}
	if(BillboardTimer) {
		clearInterval(BillboardTimer);
		BillboardTimer = undefined;
	}
	IsSeeingPhotos = false;
	document.getElementById(LeContentObjectID).innerHTML = "";
	document.getElementById(LeArticleObjectID).innerHTML = "";
	document.getElementById(LeArticleContainerObjectID).style.display = "none";
	document.getElementById("BillboardContainer").style.display = "none";
	document.getElementById("BillboardContent").innerHTML = "";
	document.getElementById("LeContent").style.display = "flex";
	document.getElementById("LeMenu").className = "UpTitle";
	//document.getElementById("BillboardContainer").innerHTML = "";
}

//Hash navigation
var BypassALL = false;
window.onhashchange = GoHash = function(BypassMasterPage) {
	if(BypassALL == true) {
		BypassALL = false;
		return;
	}
	setTimeout(OnResizeChangePage, 500);
	if(location.hash != "") {
		var hashvalue = location.hash.substring(1, location.hash.length);
		//LoadPage(hashvalue + "/index.json");
	}
	else {
		var hashvalue = "home";
	}
	if(BypassMasterPage != true) {
		if(MasterPageMap) {
			var Found = false;
			MasterPageMap.map(function(item, index) {
				if(Found) {
					return;
				}
				if(item.name == hashvalue) {
					if(MasterMobilePageLoaded == null) {
						//Still might load... let's wait
						setTimeout(GoHash, 1000);
					}
					else if(MasterMobilePageLoaded == false) {
						LoadMasterMobilePage().then(function() {
							MasterPageMap[index].TitleObj.scrollIntoView();
							UpdatePageTitle(item.title);
							HashNavUnlocked = true;
						});
					}
					else {
						MasterPageMap[index].TitleObj.scrollIntoView();
						UpdatePageTitle(item.title);
						HashNavUnlocked = true;
					}
					Found = true;
					return;
				}
				if(index == MasterPageMap.length - 1 && !Found) {
					GoHash(true);
				}
			});
		}
		else {
			//Wait
		}
		return;
	}
	if(Sitemap) {
		Sitemap.map(function(item, index) {
			if(item.name == hashvalue) {
				LoadPage(item.address);
				UpdatePageTitle(item.title);
			}
		});
	}
	var OurTitle = document.getElementById("Title");
	//ResetMobileSocialButtons
	var TheElements = document.getElementById("Mobile-Menu-Items").children;
	for(var i=0; i < TheElements.length; i++) {
		TheElements[i].classList.remove("Mobile-Menu-Item-Active");
	}
	TheElements = document.getElementById("DropDownMenu").children;
	for(var i=0; i < TheElements.length; i++) {
		TheElements[i].classList.remove("DropDown-Menu-Item-Active");
	}
	//Code section A
	switch(hashvalue) {
		case "news":
			//OurTitle.src = "index_resources/slice-1a.png";
			//document.getElementById("Mobile-Menu-Item1").classList.add("Mobile-Menu-Item-Active");
			break;
		case "about":
			//OurTitle.src = "index_resources/slice-1b.png";
			//document.getElementById("Mobile-Menu-Item2").classList.add("Mobile-Menu-Item-Active");
			break;
		case "music":
			//OurTitle.src = "index_resources/slice-1c.png";
			//document.getElementById("Mobile-Menu-Item2").classList.add("Mobile-Menu-Item-Active");
			break;
		case "photos":
			//OurTitle.src = "index_resources/slice-1d.png";
			//document.getElementById("Mobile-Menu-Item3").classList.add("Mobile-Menu-Item-Active");
			break;
		case "videos":
			//OurTitle.src = "index_resources/slice-1e.png";
			//document.getElementById("Mobile-Menu-Item4").classList.add("Mobile-Menu-Item-Active");
			break;
		default:
			//OurTitle.src = "index_resources/slice-1.png";
			break;
	}
	//End Code section A
}

function UpdatePageTitle(TheTitle) {
	if(!TheTitle || TheTitle == "") {
		TheTitle = "Corbin Hale";
	}
	document.title = TheTitle;
}

function ResetMobileSocialButtons() {
}

GetSitemap = function() {
	GetJSON("index_resources/sitemap.json").then(function(response) {
		Sitemap = response;
		GoHash();
	});
}

GetMasterPage = function() {
	return GetJSON("index_resources/MasterPage.json").then(function(response) {
		MasterPageMap = response;
		LoadMasterMobilePage();
		return response;
	});
}

function UpdateScrollHashValue() {
	if(MasterPageMap == undefined) {
		return false;
	}
	for(var i = 0; i < MasterPageMap.length;i++) {
		if(MasterPageMap[i].TitleObj == undefined) {
			continue;
		}
		if(IsInViewport(MasterPageMap[i].SectionDiv) && HashNavUnlocked) {
			var OnlyHash = "";
			if(location.hash.indexOf("&") == -1) {
				OnlyHash = location.hash.substring(1, location.hash.length);
			}
			else {
				OnlyHash = location.hash.substring(1, location.hash.indexOf("&"));
			}
			if(OnlyHash != MasterPageMap[i].name) {
				BypassALL = true;
				UpdatePageTitle(MasterPageMap[i].title);
				location.hash = MasterPageMap[i].name;
			}
			break;
		}
	}
}

function IsInViewport(el) {
	var WindowHeight = (window.innerHeight || document.documentElement.clientHeight);
	var WindowWidth = (window.innerWidth || document.documentElement.clientWidth);
	var rect = el.getBoundingClientRect();
	var WOverlap = Math.min(rect.right, WindowWidth) - Math.max(rect.left, 0);
	var HOverlap = Math.min(rect.bottom, WindowHeight) - Math.max(rect.top, 0);
	var OverlapArea = WOverlap*HOverlap;
	var TotalArea = Math.min(WindowWidth*WindowHeight, (rect.right - rect.left)*(rect.bottom - rect.top));
	if(OverlapArea/TotalArea >= 0.5) {
		return true;
	}
	else {
		return false;
	}
}


//Music Bar

MusicLibrary = undefined;
SongCursor = 0;
IsPlaying = false;
PreviousIsPlaying = false;
MusicInterval = undefined;
MusicIntervalExists = false;
UnloadCallback = undefined;
IsLoading = false;

function LoadMusicBar(TheLibrary, TheSongCursor, TheUnloadCallback) {
	if(TheSongCursor == undefined) {
		TheSongCursor = 0;
	}
	
	MBNameObj = document.getElementById("MBName");
	MBTimeObj = document.getElementById("MBTime");
	MBClockObj = document.getElementById("MBClock");
	MBPlayPauseObj = document.getElementById("MBPlayPause");
	MBBackObj = document.getElementById("MBBack");
	MBNextObj = document.getElementById("MBNext");
	MBMain = document.getElementById("MusicBar");
	
	UnloadMusicBar();
	UnloadCallback = TheUnloadCallback;
	MBMain.classList.remove("MusicBarHide");
	
	FooterBottomPosition = 151;
	pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
	//document.getElementById(FooterObjectID).style.top = pageheight - FooterBottomPosition;
	
	SongCursor = TheSongCursor;
	
	IsPlaying = false;
	PreviousIsPlaying = false;
	
	MusicLibrary = TheLibrary;
	
	for(var i = 0;i < MusicLibrary.length;i++) {
		MusicLibrary[i].player = new Audio(MusicLibrary[i].URL);
	}
	
	MBNextObj.onclick = NextSong;
	MBBackObj.onclick = PreviousSong;
	MBPlayPauseObj.onclick = PlayPauseSong;
	MBTimeObj.onmousedown = function() {
		PreviousIsPlaying = IsPlaying;
		IsPlaying = false;
	}
	MBTimeObj.onchange = function() {
		IsPlaying = PreviousIsPlaying;
	}
	
	MBNameObj.innerText = MusicLibrary[SongCursor].Name;
	
	MusicBarUpdateButtonVisibility();
	
	MusicInterval = setInterval(UpdateSongTime ,250);
	MusicIntervalExists = true;
}

function NextSong() {
	MusicLibrary[SongCursor].player.pause();
	MusicLibrary[SongCursor].player.currentTime = 0;
	MBTimeObj.value = 0;
	MBClockObj.innerText = "00:00";
	SongCursor++;
	if(SongCursor >= MusicLibrary.length) {
		SongCursor = MusicLibrary.length - 1;
	}
	MusicBarUpdateButtonVisibility();
	if(IsPlaying) {
		MBPlay(SongCursor);
	}
	MBNameObj.innerText = MusicLibrary[SongCursor].Name;
}

function SelectSong(NewCursor) {
	MusicLibrary[SongCursor].player.pause();
	MusicLibrary[SongCursor].player.currentTime = 0;
	MBTimeObj.value = 0;
	MBClockObj.innerText = "00:00";
	SongCursor = NewCursor;
	if(SongCursor >= MusicLibrary.length) {
		SongCursor = MusicLibrary.length - 1;
	}
	MusicBarUpdateButtonVisibility();
	if(IsPlaying) {
		MBPlay(SongCursor);
	}
	MBNameObj.innerText = MusicLibrary[SongCursor].Name;
}

function PreviousSong() {
	MusicLibrary[SongCursor].player.pause();
	MusicLibrary[SongCursor].player.currentTime = 0;
	MBTimeObj.value = 0;
	MBClockObj.innerText = "00:00";
	SongCursor--;
	if(SongCursor < 0) {
		SongCursor = 0;
	}
	MusicBarUpdateButtonVisibility();
	if(IsPlaying) {
		MBPlay(SongCursor);
	}
	MBNameObj.innerText = MusicLibrary[SongCursor].Name;
}

function MusicBarUpdateButtonVisibility() {
	if(SongCursor <= 0) {
		MBBack.style.opacity = 0.2;
		MBBack.style.pointerEvents = "none";
	}
	else {
		MBBack.style.opacity = 1;
		MBBack.style.pointerEvents = "auto";
	}
	if(SongCursor >= MusicLibrary.length - 1) {
		MBNext.style.opacity = 0.2;
		MBNext.style.pointerEvents = "none";
	}
	else {
		MBNext.style.opacity = 1;
		MBNext.style.pointerEvents = "auto";
	}
}

function UpdateSongTime() {
	if(!IsLoading) {
		if(IsPlaying) {
			MBTimeObj.value = (MusicLibrary[SongCursor].player.currentTime/MusicLibrary[SongCursor].player.duration)*1000;
		}
		else {
			MusicLibrary[SongCursor].player.currentTime = (MBTimeObj.value/1000)*MusicLibrary[SongCursor].player.duration;
		}
		var minutes = Math.floor(MusicLibrary[SongCursor].player.currentTime/60);
		var seconds = Math.floor(MusicLibrary[SongCursor].player.currentTime%60);
		if(minutes < 10) {
			minutes = "0" + minutes;
		}
		if(seconds < 10) {
			seconds = "0" + seconds;
		}
		MBClockObj.innerText = minutes + ":" + seconds;
		if(MusicLibrary[SongCursor].player.ended) {
			if(SongCursor == MusicLibrary.length - 1) {
				UnloadMusicBar();		
			}
			else {
				NextSong();
			}
		}
	}
}

function PlayPauseSong() {
	if(IsPlaying) {
		//pause
		MusicLibrary[SongCursor].player.pause();
		MBPlayPauseObj.innerHTML = "<i class=\"fa fa-play\" aria-hidden=\"true\"></i>";
		IsPlaying = PreviousIsPlaying = false;
	}
	else {
		//play
		MBPlay(SongCursor);
	}
}

function MBPlay(SongCursor) {
		var PlayPromise = MusicLibrary[SongCursor].player.play();
		//Compatibility code for browsers that do not return promise, such as Safari
		if(typeof(PlayPromise) != "object") {
			PlayPromise = new Promise(function(resolve, reject) {
				var CheckSongAvailability = function() {
					if(!MusicLibrary[SongCursor].player.paused) {
						clearInterval(CheckSongAvailability)
						resolve(true);
					}
				}
				setInterval(CheckSongAvailability, 500);
			});
		}
		PlayPromise.then(function(response) {
			MBPlayPauseObj.innerHTML = "<i class=\"fa fa-pause\" aria-hidden=\"true\"></i>";
			IsPlaying = PreviousIsPlaying  = true;
			document.getElementById("MusicBar").style.pointerEvents = "auto";
			document.getElementById("MusicBarFlex").style.display = "flex";
			document.getElementById("MusicBarLoadingMessage").style.display = "none";
			IsLoading = false;
		});
		document.getElementById("MusicBar").style.pointerEvents = "none";
		document.getElementById("MusicBarFlex").style.display = "none";
		document.getElementById("MusicBarLoadingMessage").style.display = "block";
		IsLoading = true;	
}

function UnloadMusicBar() {
	MBMain.classList.add("MusicBarHide");
	if(MusicIntervalExists) {
		clearInterval(MusicInterval);
		MusicIntervalExists = false;
	}
	//Let's clean up the old music library if there is one
	if(MusicLibrary != undefined) {
		if(MusicLibrary.length) {
			for(var i=0;i < MusicLibrary.length;i++) {
				MusicLibrary[i].player.pause();
				MusicLibrary[i].player.remove();
				MusicLibrary[i].player = null;
			}
		}
		MusicLibrary = undefined;
		UnloadCallback();
	}
	
	FooterBottomPosition = 101;
	pageheight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
	//document.getElementById(FooterObjectID).style.top = pageheight - FooterBottomPosition;
}





