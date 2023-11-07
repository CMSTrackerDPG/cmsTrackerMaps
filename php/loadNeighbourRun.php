<?php

$SEARCHDEPTH = 1000;

$startDir = urldecode($_POST['dir']);

$startRunNumberStr = urldecode($_POST['startRunNumber']);
$startRunNumber = intval($startRunNumberStr);
$startRunHighStr = "/" . substr($startRunNumberStr , 0, 3) . "/";
$countingDirection = intval(urldecode($_POST['direction']));
$limit = $startRunNumber + $countingDirection * $SEARCHDEPTH;
clearstatcache();

for($i = $startRunNumber + $countingDirection; $countingDirection > 0 ? $i <= $limit : $i >= $limit; $i += $countingDirection) {
	$runHigh = intval($i /  $SEARCHDEPTH);
	$runHighStr = "/" . (string)$runHigh . "/";
	$runStr = (string)$i;
	$newDir = str_replace($startRunNumberStr, $runStr, $startDir);
	$newDir = str_replace($startRunHighStr, $runHighStr, $newDir);

	if( file_exists("/eos/cms/store/group/tracker-cctrack/www/TrackerMapsReloaded/files/data/users" . $newDir) ) {
		echo $newDir;
		return;
	}
}

echo $startDir;
?>
