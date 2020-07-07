FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
)

FilePond.setOptions({
    stylePanelAspectRatio: 75/50,
    imageResizeTargetWidth: 75,
    imageResizeTargetHeight: 50
})

FilePond.parse(document.body)