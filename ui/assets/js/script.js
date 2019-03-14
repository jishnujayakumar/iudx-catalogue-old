    // Disable ctrl+s to prevent downloading source code 
    $(document).bind('keydown', function(e) {
      if(e.ctrlKey && (e.which == 83)) {
        e.preventDefault();
        // alert('Ctrl+S');
        return false;
      }
    });

    function cache_cat(){
      $.get( "/cat/search", function( data ) {
        localStorage.setItem("data",data);
      });
    }

    if(localStorage.getItem("data")==null){
      cache_cat();
    }

    function display_tag_cloud(){
      var seen_tags_set = [];
      var tag_cloud_html = [];
      data=JSON.parse(localStorage.getItem("data"))
      for (var item_index = 0; item_index < data.length-1; item_index++) {
        for (var tag_item_index = 0; tag_item_index < data[item_index]['tags'].length-1; tag_item_index++) {
          if(!seen_tags_set.includes(data[item_index]['tags'][tag_item_index])){
            seen_tags_set.push(data[item_index]['tags'][tag_item_index])
            tag_cloud_html.push(`<a href="/cat/search/attribute?tags=(`+data[item_index]['tags'][tag_item_index]+`)" target="_blank"><button style="margin:10px;" type="button" class="btn btn-default">`+data[item_index]['tags'][tag_item_index]+`</button></a>`)
          }
        }
      }
      seen_tags_set=[]
      $("#tag_cloud").html( tag_cloud_html );
      tag_cloud_html=[]
    }

    // display_tag_cloud();

    var seen_tags_dict={}

    function populate_side_bar(){
      var seen_tags_set = [];
      var tag_cloud_html = [];
      data=JSON.parse(localStorage.getItem("data"))
      for (var item_index = 0; item_index < data.length-1; item_index++) {
        for (var tag_item_index = 0; tag_item_index < data[item_index]['tags'].length-1; tag_item_index++) {
          if(!seen_tags_set.includes(data[item_index]['tags'][tag_item_index])){
            seen_tags_set.push(data[item_index]['tags'][tag_item_index])
            tag_cloud_html.push(`<li class="nav-item">
            <a class="nav-link center" href="#" onclick="show_items_of('`+data[item_index]['tags'][tag_item_index]+`')">
              <p>`+data[item_index]['tags'][tag_item_index]+`</p>
            </a>
          </li>`)
          }
        }
      }

      for (var i = seen_tags_set.length - 1; i >= 0; i--) {
      	seen_tags_dict[seen_tags_set[i]]=null;
      }

      seen_tags_set=[]
      $("#tags_side_bar").html( tag_cloud_html );
      tag_cloud_html=[]
    }

    function show_items_of(tag){
	  	$.get( "/cat/search/attribute?tags=("+tag+")", function( data ) {
	  		// console.log(data)
	  		data=JSON.parse(data)
	  		var html_to_add="";
	  		var item_details_card_html=""
	  		for (var i = data.length - 1; i >= 0; i--) {
	  			html_to_add+=`
             <div class="card">
             
    <div class="card-content" onclick="show_details_of('`+i+`')">
      <span class="card-title activator blue-text text-darken-4">`+data[i]['NAME']+`</span>
      <!--span>Status:`+data[i]['__itemStatus']+`</span><br-->
      <span>`+data[i]['itemDescription']+`</span>
    </div>
    <!--div class="card-reveal">
      <span class="card-title grey-text text-darken-4">Item details<i class="material-icons right">close</i></span>
      <p>`+JSON.stringify(data[i])+`</p>
    </div-->
  </div>`
  				item_details_card_html+=`<div id="`+i+`" class="row id_row" style="display:none">
    <div class="col s12">
      <div class="card white">
        <div class="card-content black-text">
          <span class="card-title">Item Details</span>
          <code id="json-renderer-`+i+`">`+JSON.stringify(data[i])+`</code>
        </div>
        <div class="card-action">
          <div id="latest_data_`+i+`"></div>
          <!--a class="blue-text lighten-1" href="#" onclick="show_latest_data('`+i+`','`+data[i]['latestResourceData']+`')">Latest Data `+i+`</a-->
          <a class="blue-text lighten-1" href="`+data[i]['latestResourceData']+`" target="_blank">Latest Data</a>
        </div>
      </div>
    </div>
  </div>`
	  		}
	  		$("#searched_items").html(html_to_add)
	  		$("#item_details_card").html(item_details_card_html)
	    });
    }

    function show_details_of(id){
	  	$(".id_row").hide();
	  	$("#"+id).show();
    }

    function show_latest_data(id,_url){
    	// $.ajax({
    	// 	url: _url,
    	// 	dataType: "jsonp",
    	// 	type: "GET",
    	// 	contentType: "application/json",
    	// 	crossDomain: true,
    	// 	success: function(data){
    	// 		console.log(data)
    	// 	},
    	// 	error: function(){
    	// 		console.log("error")
    	// 	}
    	// });
    	$.get( _url, function( data ) {
		  	$("latest_data_"+id).html(data);
      	});
    }

    function refresh_tags(){
    	$.get( "/cat/search", function( data ) {
	    	if(localStorage.getItem("data")==data){
	    		M.toast({html: 'No new updates found', classes: 'rounded', displayLength: 1000})	
	    	}else{
	    		localStorage.setItem("data",data);
	    		populate_side_bar();
	    		M.toast({html: 'Tags Updated.', classes: 'rounded', displayLength: 1000})
	    	}
      	});
    }



    


    // console.log("l",localStorage.getItem("data"))
