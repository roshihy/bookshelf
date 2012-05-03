Books = new Meteor.Collection("books");

Template.book_list.books = function () {
	  return Books.find({}, {sort: {_id: -1}});
};

Template.book_list.events = {
	'click a.borrow' : function () {
		var isbn = $(arguments[0].target).next().val();
	    Books.update({isbn: isbn}, {$set: {borrow: true}});
	},
	'click a.return' : function () {
		var isbn = $(arguments[0].target).next().val();
	    Books.update({isbn: isbn}, {$set: {borrow: false}});
	}
};

Template.modal_add.events = {
	'click a.add' : function(){

		var isbn = $("input#isbn-input").val();

		//バリデーション
		if(isbn.match(/[^0-9]+/)){
			alert("ISBN-13として不正な値です：「" + isbn + "」");
			return;
		};

		if(!isbn.length === 13){
			alert("桁数が不正です：「" + isbn + "」");
			return;
		};

		if(Books.find({isbn: isbn}).count() !=　0){
			alert("すでにその書籍は登録されています。");
			return;
		};

		var bookInfo = {};
		bookInfo = BS.rakutenApiCall(isbn);
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
						isbn : isbn,
					};
					Books.insert(ret);
					alert("登録が完了しました");
				} else {
					alert("該当書籍が見つかりませんでした。");
				};
			},
			error: function(xhr, status, err){
				alert("該当書籍が見つかりませんでした。");
			},
		});
	};
})();