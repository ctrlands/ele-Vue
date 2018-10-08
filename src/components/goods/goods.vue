<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" :key="index" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
					<span class="text border-1px">
						<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref="foodsWrapper">
			<ul>
				<li v-for="(item,index) in goods" :key="index" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,indexs) in item.foods" :key="indexs" class="food-item border-1px">
							<div class="icon">
								<img width="57" height="57" :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.ratin}}</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper" >
									<cartcontrol :food="food"></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<shopcart :selectFoods='selectFoods' :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
	</div>
</template>

<script type="text/ecmascrtipt-6">
	import BScroll from 'better-scroll';
	import shopcart from '../../components/shopcart/shopcart';
	import cartcontrol from '../../components/cartcontrol/cartcontrol';
	const ERR_OK = 0;
	export default {
		props: {
			seller: {
				type: Object
			}
		},
		data () {
			return {
				goods: [], // 已选商品信息
				listHeight: [], // 每个菜单将要滑动的height
				scrollY: 0
			};
		},
		computed: {
			// 选中到购物车中商品数据，由每一个food对象组成
			selectFoods () {
				let foods = [];
				this.goods.forEach((item) => {
					item.foods.forEach((fd) => {
						if (fd.count) {
							foods.push(fd);
						}
					});
				});
				return foods;
			},
			currentIndex () {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						return i;
					}
				}
				return 0;
			}
		},
		created () {
			// 左侧菜单图标信息
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			// goods商品数据请求
			this.$http.get('/api/goods').then((response) => {
				response = response.body;
				if (response.errno === ERR_OK) {
					this.goods = response.data; this.$nextTick(() => {
						this._initScroll();
					});
				}
			});
		},
		methods: {
			// 点击菜单显示右侧相应数据
			selectMenu (index, event) {
				if (!event._constructed) {
					return;
				}
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodsScroll.scrollToElement(el, 300);
			},
			// 初始化better-scroll
			_initScroll () {
				// 获取better-scroll实例
				this.meunScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				});
				this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					probeType: 3
				});
				this.foodsScroll.on('scroll', (pos) => {
					this.scrollY = Math.abs(Math.round(pos.y));
				});
			},
			// 获取右侧商品每个列表的y坐标，组成数组listHeight
			_calculateHeight () {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				// 第一个列表坐标
				let height = 0;
				this.listHeight.push(height);
				for (let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			}
		},
		components: {
			shopcart,
			cartcontrol
		}
	};
</script>

<style lang="stylus" type="stylesheet/stylus">
	@import "../../common/stylus/mixin.styl"
	.goods
		display: flex
		position: absolute
		top: 174px
		width: 100%
		bottom: 46px
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				// 垂直居中技巧
				display: table
				width: 56px
				height: 54px
				padding: 0 12px
				line-height: 14px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					background: #fff
					font-wight: 700
					.text
						border-none()
				.icon
					display: inline-block
					vertical-align: top
					width: 12px
					height: 12px
					margin-right: 2px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					border-1px(rgba(7, 17, 27, 0.1))
					font-size: 12px
		.foods-wrapper
			flex: 1
			background: #fff
			height: 100%
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				font-size: 12px
				color: rga(147, 153, 159)
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.1))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					.name
						margin: 2px 0 8px 0
						height: 14px
						line-height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc, .extra
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
						line-height: 12px
					.extra
						&.count
							margin-right: 12px
					.price
						font-wight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 14px
							color: rgb(240, 0, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper
						position: absolute
						right: 0
						bottom: 12px
</style>
