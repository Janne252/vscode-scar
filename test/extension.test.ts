
import * as assert from 'assert';


import * as vscode from 'vscode';
import ItemSourceMerger from '../src/itemSourceMerger/itemSourceMerger';
import StaticItemSource from '../src/itemSourceMerger/source/static';
import ActiveItemSource from '../src/itemSourceMerger/source/active';
import Item from '../src/itemSourceMerger/item/item';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => 
{
    // Defines a Mocha unit test
    test("ItemSourceMerger static source", () => 
    {
        let fooItem = new Item('foo');

        let items =  [
            fooItem,
            new Item('bar'),
            new Item('zoo'),
        ];

        let merger = new ItemSourceMerger<Item>();
        let staticSource = new StaticItemSource<Item>('staticSource01', items);

        merger.addStaticSource(staticSource);

        assert.deepEqual(merger.getAllItems(), items, 'merger items match source items');

        assert.equal(merger.getItem((item) => 
        {
            return item.id == 'foo'
        }), fooItem, 'merger.getItem matches expected source item');

        assert.notEqual(merger.getItem((item) => 
        {
            return item.id == 'foobar'
        }), fooItem, 'merger.getItem matches expected source item');

        let foobarItem = new Item('foobar');

        let staticSource02 = new StaticItemSource<Item>('staticSource02', [foobarItem]);
        merger.addStaticSource(staticSource02);

        assert.equal(merger.getItem((item) => item.id == 'foobar'), foobarItem, 'merger.getItem matches expected source item');
    });

    test('ItemSourceMerger active source simple init with items', () => 
    {
        let fooItem = new Item('foo');

        let items =  [
            fooItem,
            new Item('bar'),
            new Item('zoo'),
        ];
        
        let merger = new ItemSourceMerger<Item>();
        let activeSource01 = new ActiveItemSource<Item>('activeSource01', items);

        merger.addActiveSource(activeSource01);

        assert.deepEqual(merger.getAllItems(), items);
        assert.equal(merger.getItem((item) => item.id == fooItem.id), fooItem);

    });

    test('ItemSourceMerger active source update', () => 
    {
    let fooItem = new Item('foo');

        let items =  [
            fooItem,
            new Item('bar'),
            new Item('zoo'),
        ];
        
        let merger = new ItemSourceMerger<Item>();
        let activeSource01 = new ActiveItemSource<Item>('activeSource01', items);

        merger.addActiveSource(activeSource01);

        let newItems = [
            new Item('John'),
            new Item('Mike'),
            new Item('Paul'),
        ];

        activeSource01.updateItems(newItems);

        assert.deepEqual(merger.getAllItems(), newItems, 'items match updated items after updateItems');

        activeSource01.updateItems(newItems.concat(items));

        assert.deepEqual(merger.getAllItems(), newItems.concat(items), 'items match items after update items');
    });


    test('ItemSourceMerger active source: Multiple active sources', () => 
    {
        let merger = new ItemSourceMerger<Item>();

        let source01 = new ActiveItemSource<Item>('activeSource01');
        let source02 = new ActiveItemSource<Item>('activeSource01');

        merger.addActiveSource(source01);
        merger.addActiveSource(source02);

        source01.updateItems([
            new Item('John'),
            new Item('Mike'),
            new Item('Paul')
        ]);

        source02.updateItems([
            new Item('Susan'),
            new Item('Elisabeth'),
            new Item('Carol')
        ]);

        assert.deepEqual(merger.getAllItems(), source01.getAllItems().concat(source02.getAllItems()), 'multiple sources match');
    });
});