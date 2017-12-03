""" Utity functions """

def hms_to_seconds(t):
	""" Converts h:m:s to just seconds """
	if t is not None:
	   	h, m, s = [int(i) for i in t.split(':')]
		return 3600*h + 60*m + s
	else:
	    return None