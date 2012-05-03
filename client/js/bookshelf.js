//////////////////////////////////////////////
//コレクション定義
//
Books = new Meteor.Collection("books");

//////////////////////////////////////////////
//セッション定義
//
Session.set('tag_filter', null);
Session.set('editing_addtag', null);
Session.set('editing_itemname', null);

//////////////////////////////////////////////
//独自定義関数
//
var focus_field_by_id = function (id) {
  var input = document.getElementById(id);
  if (input) {
    input.focus();
    input.select();
  }
};

var BS = {};
(function(){
	BS.rakutenUrl = 'http://api.rakuten.co.jp/rws/3.0/json';
	BS.params = {
			developerId : '0e4c3e1c49abcaf374e395ddd1fd273a',
			operation : 'BooksBookSearch',
			version : '2011-12-01',
			isbn : '',
	};
	BS.rakutenApiCall = function(isbn){
		var ret = {};
		BS.params.isbn = isbn;

		$.ajax({
			type: 'GET',
			data: BS.params,
			url: BS.rakutenUrl,
			dataType: 'JSONP',
			jsonp: 'callBack',
			async: false,
			success: function(data, status, xhr){
				if(data["Body"]){
					var item = data["Body"]["BooksBookSearch"]["Items"]["Item"][0];
					ret = {
						author : item["author"],
						title : item["title"],
						cap : item["itemCaption"],
						image : item["mediumImageUrl"],
						itemUrl : item["itemUrl"],
						price: item["itemPrice"],
						titleKana: item["titleKana"],
						isbn : isbn,
					};
					Books.insert(ret);
					alert("登録が完了しました");
				} else {
					alert("該当書籍が見つかりませんでした。");
				};
			},
			error: function(xhr, status, err){
				alert("該当書籍が見つかりませんでした。。");
			},
		});
	};
})();

var okcancel_events = function (selector) {
	return 'keyup '+selector+', keydown '+selector+', focusout '+selector;
};

var make_okcancel_handler = function (options) {
	var ok = options.ok || function () {};
	var cancel = options.cancel || function () {};

	return function (evt) {
		if (evt.type === "keydown" && evt.which === 27) {
			// escape = cancel
			cancel.call(this, evt);
		} else if (evt.type === "focusout") {
			// blur/return/enter = ok/submit if non-empty
			var value = String(evt.target.value || "");
			if (value) {
				ok.call(this, value, evt);
			} else {
				cancel.call(this, evt);
			}
		}
	};
};

//////////////////////////////////////////////
//Handlebars変数定義
//

//書籍の貸し出し状態を判別して返す
Template.book.borrow = function () {
	return this.borrow ? "alert" : "";
};

//タグフィルター用のタグ名/カウント数を返す
Template.tag_filter.tags = function () {
  var tag_infos = [];
  var total_count = 0;

  Books.find({}).forEach(function (book) {
    _.each(book.tags, function (tag) {
      var tag_info = _.find(tag_infos, function (x) { return x.tag === tag; });
      if (! tag_info)
        tag_infos.push({tag: tag, count: 1});
      else
        tag_info.count++;
    });
    total_count++;
  });

  tag_infos = _.sortBy(tag_infos, function (x) { return x.tag; });
  tag_infos.unshift({tag: null, count: total_count});

  return tag_infos;
};

//タグのテキスト、なければ「すべて選択」を返す
Template.tag_item.tag_text = function () {
  return this.tag || "すべて選択";
};

//選択されているタグの識別にために"selected"文言を返す
Template.tag_item.selected = function () {
  return Session.equals('tag_filter', this.tag) ? 'selected' : '';
};

//各書籍に付与されているタグを配列にして返す
Template.book.tags_list = function () {
	var book_id = this._id;
	return _.map(this.tags || [], function (tag) {
		return {book_id: book_id, tag: tag};
	});
};

//adding_tagの真偽を返す（タグ追加編集に入れば真）
Template.book.adding_tag = function () {
	return Session.equals('editing_addtag', this._id);
};

//選択されているタグにより、表出する書籍を変更する
Template.book_list.books = function () {
	  var tag_filter = Session.get('tag_filter');
	  var sel = {};
	  if (tag_filter){
		  sel.tags = tag_filter;
	  }
	  return Books.find(sel, {sort: {_id: 1}});
};


//////////////////////////////////////////////
//イベント定義
//
Template.book.events = {
	'click a.borrow' : function () {
	    Books.update({_id: this._id}, {$set: {borrow: true}});
	},
	'click a.return' : function () {
	    Books.update({_id: this._id}, {$set: {borrow: false}});
	},
	'click .addtag': function (evt) {
		Session.set('editing_addtag', this._id);
		Meteor.flush();
		focus_field_by_id("edittag-input");
	},
};

Template.modal_add.events = {
	'click a.add' : function(){
		var isbn = $("input#isbn-input").val();
		//バリデーション
		if(isbn.match(/[^0-9]+/)){
			alert("ISBN-13として不正な値です：「" + isbn + "」");
			return;
		} else if(!isbn.length === 13){
			alert("桁数が不正です：「" + isbn + "」");
			return;
		} else if(Books.find({isbn: isbn}).count() !=　0){
			alert("すでにその書籍は登録されています。");
			return;
		};
		//書籍情報を取得しDBに格納する処理
		BS.rakutenApiCall(isbn);
	}
};

Template.tag_item.events = {
	'mousedown': function () {
		if (Session.equals('tag_filter', this.tag)){
			Session.set('tag_filter', null);
		} else {
			Session.set('tag_filter', this.tag);
		}
	}
};

Template.book.events[ okcancel_events('#edittag-input') ] =
	  make_okcancel_handler({
	    ok: function (value) {
	      Books.update({_id: this._id}, {$addToSet: {tags: value}});
	      Session.set('editing_addtag', null);
	    },
	    cancel: function () {
	      Session.set('editing_addtag', null);
	    }
});

Template.tag.events = {
	'click .remove': function (evt) {
	var tag = this.tag;
	var id = this.book_id;

    evt.target.parentNode.style.opacity = 0;
    Meteor.setTimeout(function () {
    	Books.update({_id: id}, {$pull: {tags: tag}});
	}, 300);
	  }
};