require('asdfasdfa');

###*
 * CollectionDropdown
 *
 * Shows a dropdown given a collection and collectionViewOptions
 *
 * For basic usage, provide a collection and collectionViewOptions
 *
 * ```
 *
 *  showCollectionDropdown: ->
 *    view = new Mavenlink.Controls.Views.CollectionDropdown
 *      defaultText: 'Choose Department(s)'
 *      autoclose: true
 *      collectionViewOptions:
 *        itemView: Mavenlink.Features.AccountMembership.Views.OrganizationRow
 *        collection: @collection
 *
 * ```
 *
 * Options:
 *  - defaultText: text the dropdown should display when not open
 *  - collectionViewOptions: options object that is passed to the dropdown's internal collection view
 *  - collection: collection to render
 *  - collectionViewClass: optional custom class to render instead of Backbone.Marionette.CollectionView
 *  - autoclose: true if the view should close when an itemview is clicked.  For this to work your itemview must trigger 'click' when clicked.
 *
 * The dropdown will forward any itemview events onwards.  For example:
 * ```
 *  class SampleItemView
 *    triggers: {'hover': 'hover'}
 *
 *  showCollectionDropdown: ->
 *    view = new Mavenlink.Controls.Views.CollectionDropdown
 *      collectionViewOptions:
 *        itemView: SampleItemView
 *        collection: @collection
 *
 *    @listenTo view, 'hover', -> log 'itemView has been hovered'
 * ```
 *
###

class This.Other.Item extends My.Missing.View
