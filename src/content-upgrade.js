/*global MAPJS, _*/
MAPJS.contentUpgrade = function (content) {
	'use strict';
	var upgradeV2 = function () {
			var doUpgrade = function (idea) {
					var collapsed;

					if (idea.style) {
						idea.attr = {};
						collapsed = idea.style.collapsed;
						delete idea.style.collapsed;
						idea.attr.style = idea.style;
						if (collapsed) {
							idea.attr.collapsed = collapsed;
						}
						delete idea.style;
					}
					if (idea.ideas) {
						_.each(idea.ideas, doUpgrade);
					}
				};
			if (content.formatVersion && content.formatVersion >= 2) {
				return;
			}
			doUpgrade(content);
			content.formatVersion = 2;
		},
		upgradeV3 = function () {
			var doUpgrade = function () {
					var rootAttrKeys = ['theme', 'measurements-config', 'storyboards'],
						oldRootAttr = (content && content.attr) || {},
						newRootAttr = _.pick(oldRootAttr, rootAttrKeys),
						newRootNodeAttr = _.omit(oldRootAttr, rootAttrKeys),
						firstLevel = (content && content.ideas) || {},
						newRoot = {
							id: content.id,
							title: content.title,
							ideas: firstLevel,
							attr: newRootNodeAttr
						};
					content.id = 'root';
					content.ideas = {
						1: newRoot
					};
					delete content.title;
					content.attr = newRootAttr;
				};
			if (content.formatVersion && content.formatVersion >= 3) {
				return;
			}
			doUpgrade();
			content.formatVersion = 3;
		};

	upgradeV2();
	upgradeV3();
	return content;
};
