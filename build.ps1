$CurrentFullPath = (Get-Location).Path

$svgDiagramSingleFileFullPath = Join-Path $CurrentFullPath "svgdiagram.js"
if (Test-Path $svgDiagramSingleFileFullPath) {
	Remove-Item -Path $svgDiagramSingleFileFullPath
}

$JsFilesFolderFullPath = Join-Path $CurrentFullPath "src"
$JsFileNames =
	'svg.js',
	'svg_extended.js',
	'rnode.js',
	'drawDiagram.js'

$JsFilesFullPaths = 
	$JsFileNames | Foreach-Object { Join-Path $JsFilesFolderFullPath $_ } | Where-Object { Test-Path $_ }
$JsFilesFullPaths | 
	Foreach-Object {
		$JsFileContent = (Get-Content -Path $_)
		if ($JsFileContent -eq $null) {
			$JsFileContent = ''
		}
		else {
			$JsFileContent = $JsFileContent.Replace("coordinateSystem", "// coordinateSystem") + "`r`n`r`n"
		}
		
		$JsFileContent | Out-File -FilePath $svgDiagramSingleFileFullPath -Append -Encoding utf8
	}

"    [Re-]Built: $svgDiagramSingleFileFullPath"
