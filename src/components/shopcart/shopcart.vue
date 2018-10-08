<template>
	<div class="shopcart">
		<div class="content">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" @click="showChoicedFoods" :class="logobg">
						<i class="icon-shopping_cart" :class="{'highlight':totalCount==0}" v-show="totalCount==0"></i>
						<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}" style="color: #fff;" v-show="totalCount>0"></i>
					</div>
					<div class="num" v-show="totalCount>0">
						{{totalCount}}
					</div>
				</div>
				<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}元</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="payClass">
					{{payDesc}}
				</div>
			</div>
		</div>
		<!-- 已选商品信息列表显示层 -->
		<div class="showGetFoods" v-show="isShow">
			<ul>
				<li class="foodsWrapper" v-for="(item, index) in selectFoods" :key="index">
					<span class="foodsName">{{item.name}}</span>
					<span class="foodsPrice">￥{{item.price}}</span>
					<span class="foodsCount">{{item.count}}</span>
				</li>
			</ul>
		</div>
		<!-- <div class="cartcontrol-wrapper">
			<cartcontrol :selectFoods="selectFoods"></cartcontrol>
		</div> -->
	</div>
</template>

<script type="text/ecmascrtipt-6">
	import cartcontrol from '../../components/cartcontrol/cartcontrol';
	export default {
		props: {
			// 选择商品
			selectFoods: {
				type: Array,
				default () {
					return [];
				}
			},
			// 配送费
			deliveryPrice: {
				type: Number,
				default: 0
			},
			// 起送价
			minPrice: {
				type: Number,
				default: 0
			}
			// 隐藏
			// isShow: {
			// 	type: Boolean,
			// 	default: false
			// }
		},
		data () {
			return {
				isShow: false
			};
		},
		computed: {
			totalPrice () {
				let total = 0;
				this.selectFoods.forEach((food) => {
					total += food.price * food.count;
				});
				return total;
			},
			totalCount () {
				let count = 0;
				this.selectFoods.forEach((food) => {
					count += food.count;
				});
				return count;
			},
			payDesc () {
				if (this.totalPrice === 0) {
					return `￥${this.minPrice}元起送`;
				} else if (this.totalPrice < this.minPrice) {
					let diff = this.minPrice - this.totalPrice;
					return `还差元￥${diff}元起送`;
				} else {
					return '去结算';
				}
			},
			payClass () {
				if (this.totalPrice < this.minPrice) {
					return 'not-enough';
				} else {
					return 'enough';
				}
			},
			logobg () {
				if (this.totalCount === 0) {
					return 'hightlights';
				} else {
					return 'hightlightOn';
				}
			}
		},
		methods: {
			showChoicedFoods () {
				this.isShow = !this.isShow;
				let foodsList = [];
				this.selectFoods.forEach((items) => {
					// items.foods.forEach((food) => {
					// 	if (food.name) {
					// 		foodsList.push(food.name);
					// 	}
					// });
					foodsList.push({'name': items.name, 'price': items.price, 'count': items.count});
				});
			}
		},
		components: {
			cartcontrol
		}
	};
</script>

<style lang="stylus" type="stylesheet/stylus">
	.shopcart
		position: fixed
		left: 0
		bottom: 0
		z-index: 50
		width: 100%
		height: 48px
		background: #ccc
		.showGetFoods
			position: absolute
			width: 100%
			height: 340px
			background-color: #ccc
			font-size: 14px
			margin-top: -340px
			z-index: 200
			.foodsWrapper
				height: 50px
				line-height: 50px
				padding-left: 10px
				background-color: #eee
			.foodsName
				display: inline-block
				width: 160px
				overflow: hidden
				text-overflow: ellipsis
				white-space: nowrap
				vertical-align: bottom
			.foodsPrice
				display: inline-block
				width: 30px
				color: rgb(255, 83, 57)
			.foodsCount
				display inline-block
		.content
			display: flex
			background: rgba(61, 61, 63, .9)
			font-size: 0
			color: rgba(255, 255, 255, 0.4)
			position: absolute
			z-index: 400
			.content-left
				flex: 1
				.logo-wrapper
					display: inline-block
					position: relative
					top: -10px
					margin: 0 12px
					padding: 6px
					width: 56px
					height: 56px
					box-sizing: border-box
					vertical-align: top
					border-radius: 50%
					background: rgb(67, 67, 67)
					.logo
						width: 100%
						height: 100%
						border-radius: 50%
						text-align: center
						$.highlight
							background: rgb(0, 160, 220)
						.icon-shopping_cart
							line-height: 44px
							font-size: 24px
							color: #80858a
							$.highlight
								color: #fff
					.hightlightOn
						background: rgb(13, 148, 253)
					.hightlights
						background: #363636
					.num
						position: absolute
						top: 0
						right: 0
						width: 24px
						height: 16px
						line-height: 16px
						text-align: center
						border-radius: 16px
						font-size: 9px
						font-weight: 700
						color: #fff
						background: rgb(240, 20, 20)
						box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4)
				.price
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin-top: 12px
					padding-right: 12px
					box-sizing: border-box
					border-right: 1px solid rgba(255, 255, 255, 0.1)
					font-size: 16px
					font-weight: 700
					&.highlight
						color: #fff
				.desc
					display: inline-block
					vertical-align: top
					line-height: 24px
					margin: 12px 0 0 12px
					font-size: 10px
					font-weight: 700
			.content-right
				flex: 0 0 105px
				width: 105px
				.pay
					height: 48px
					line-height: 48px
					text-align: center
					font-size: 12px
					font-weight: 700
					&.not-enough
						background: #535356
					&.enough
						background: rgb(53, 201, 116)
						color: #fff
</style>
