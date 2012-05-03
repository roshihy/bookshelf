// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
	if(Books.find().count() === 0){
		var data = [
            {
            	isbn: "9784873113296",
            	title: "JavaScript第5版",
            	author: "デ-ヴィド・フラナガン/村上列",
            	image: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8731/87311329.jpg?_ex=120x120",
            	cap: "言語解説部分とリファレンス部分に分け、その言語解説部分をまとめたもの。第５版では、全章の内容を更新し、ＸＭＬＨＴＴＰＲｅｑｕｅｓｔオブジェクトでスクリプトからＨＴＴＰリクエストに送信する方法、ＪａｖａＳｃｒｉｐｔを使ってＸＭＬデータの制御、またＪａｖａＳｃｒｉｐｔによるグラフィックの制御機能についてなど、新しい話題を追加した。",
            	itemUrl: "http://books.rakuten.co.jp/rb/4493265/",
            	tags: [
            	       "hogehoge",
            	       "fugafuga",
            	       ],
            	 titleKana: "ジャヴァスクリプトダイゴハン"
            },
            {
            	isbn: "9784873113258",
            	title: "JavaScriptクイックリファレンス",
            	author: "デ-ヴィド・フラナガン/木下哲也",
            	image: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8731/87311325.jpg?_ex=120x120",
            	cap: "本書は、ＪａｖａＳｃｒｉｐｔのリファレンスについて、コアＪａｖａＳｃｒｉｐｔとクライアントサイドＪａｖａＳｃｒｉｐｔに分けて解説しています。コアＪａｖａＳｃｒｉｐｔリファレンスでは、ＪａｖａＳｃｒｉｐｔ　１．５とＥＣＭＡＳｃｒｉｐｔバージョン３によって定義されたすべてのクラス、オブジェクト、コンストラクタ、メソッド、関数、プロパティ、定数について解説します。クライアントサイドＪａｖａＳｃｒｉｐｔのリファレンスでは、レガシーなブラウザ対応のＡＰＩ、Ｄｏｍレベル２の標準的なＡＰＩを扱うほか、ＸＭＬＨＴＴＰＲｅｑｕｅｓｔオブジェクトやｃａｎｖａｓタグのような新しい情報もカバーします。",
            	itemUrl: "http://books.rakuten.co.jp/rb/4407582/",
            	tags: [
            	       "hogehoge",
            	       "piyoipiyo"
            	       ],
              	 titleKana: "ジャヴァスクリプトクイックリファレンス"
            },
            {
            	isbn: "9784774142043",
            	title: "Webを支える技術",
            	author: "山本陽平",
            	image: "http://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7741/77414204.jpg?_ex=120x120",
            	cap: "本書のテーマはＷｅｂサービスの実践的な設計。まず良いＷｅｂサービス設計の第一歩として、ＨＴＴＰやＵＲＩ、ＨＴＭＬなどの仕様を歴史や設計思想を織り交ぜて解説。そしてＷｅｂサービスにおける設計課題、たとえば望ましいＵＲＩ、ＨＴＴＰメソッドの使い分け、クライアントとサーバの役割分担、設計プロセスなどについて、現時点でのベストプラクティスを紹介。",
            	itemUrl: "http://books.rakuten.co.jp/rb/6385779/",
            	tags: [
            	       "fugafuga",
            	       "piyoipiyo"
            	       ],
               	 titleKana: "ウェブヲササエルギジュツ"
            }
        ];
		for (var i = 0; i < data.length; i++) {
			Books.insert(data[i]);
		};
	};
});

Books = new Meteor.Collection("books");
