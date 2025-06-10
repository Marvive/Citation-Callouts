## Citation Callouts Plugin
### Description
I want to create an Obsidian Plugin that detects when I'm pasting content with citations from various sources.

The original focus was for Logos Bible Software (URLs containing "https://ref.ly/logosres"), but it should work with any properly formatted citation.

When using the special paste command, the callout type should be "[!Citation] ${source_name}" and the icon for the callout should be a book.

In the below example, the clipboard is the source, and I want the special paste option to be the Target.

### Source
"Harnack defined Christianity as ''a very simple but very sublime thing: To live in time and for eternity _under the eye of God_ and by His help.''

 Leonard Ravenhill, [_Why Revival Tarries_](https://ref.ly/logosres/49dc6caf8be0e46ee4357668eca86f96?art=r20&off=43&ctx=l+Tarries%E2%80%94Because++%0a~Harnack+defined+Chri) (Grand Rapids, MI: Bethany House, 2004).

### Target
> [!Citation] Why Revival Tarries
> "Harnack defined Christianity as ''a very simple but very sublime thing: To live in time and for eternity _under the eye of God_ and by His help.''
> 
>  Leonard Ravenhill, [_Why Revival Tarries_](https://ref.ly/logosres/49dc6caf8be0e46ee4357668eca86f96?art=r20&off=43&ctx=l+Tarries%E2%80%94Because++%0a~Harnack+defined+Chri) (Grand Rapids, MI: Bethany House, 2004).

