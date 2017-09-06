# MVC 

Pros:

* perfect for one to one mapping: 20 views <=> 20 controllers <=> 20 models 
* good separation of concerns
* easy to maintain and test

Cons: 视图变化太快，模型需要经常变动

Sometimes your view may show several kinds of models, so it's hard to manage the relationship between view and model mappings. i.e, At first, you have a product view showing only product list. When project gets larger, this view may need include user model, comment model, etc. And other views may have the same issue. These dependencies are difficult to manage, and maybe there're cyclic dependencies. In Asp.net MVC, the solution is create a viewModel. But you have to write extra code about viewModel.

# Flux architecture

Due to the MVC shortcomings, Facebook has a view including message list, a small message window, message indicator on right conner. They use flux to manage the message state.

flux one way data flow just as react:

view(jsx) --> actions --> dispatcher(singleton, make sure action is handler one by one) --> stores(read only) --> back to view

<img src="http://om1o84p1p.bkt.clouddn.com/flux.png"  />

