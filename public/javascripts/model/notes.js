// Note Model

dc.model.Note = dc.Model.extend({

  document : function() {
    return this._document = this._document || Documents.get(this.get('document_id'));
  },

  allowedToEdit : function() {
    var acc = Accounts.current();
    if (this.get('account_id') == acc.id) return true;
    if (this.get('organization_id') == acc.get('organization_id') && acc.isAdmin()) return true;
    if (_.include(acc.get('shared_document_ids'), this.get('document_id'))) return true;
    return false;
  },

  imageUrl : function() {
    return this._imageUrl = this._imageUrl ||
      this.document().get('page_image_url').replace('{size}', 'normal').replace('{page}', this.get('page'));
  },

  coordinates : function() {
    if (this._coordinates) return this._coordinates;
    var serialized = this.get('location').image;
    var css = _.map(serialized.split(','), function(num){ return parseInt(num, 10); });
    return this._coordinates = {
      top:    css[0],
      left:   css[3],
      right:  css[1],
      height: css[2] - css[0],
      width:  css[3] - css[1]
    };
  }

});

// Note Set

dc.model.NoteSet = dc.model.RESTfulSet.extend({

  resource : 'notes',
  model    : dc.model.Note,

  comparator : function(note) {
    return note.get('page') * 10000 + note.coordinates().top;
  }

});

dc.model.NoteSet.implement(dc.model.SortedSet);
