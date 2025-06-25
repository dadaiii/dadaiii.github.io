import maya.cmds as cmds

original_curves = {}
selected_keys = {}
undo_open = False

def store_original_curves_and_keys():
    global original_curves, selected_keys
    original_curves = {}
    selected_keys = {}
    sel = cmds.keyframe(q=True, sl=True, name=True)
    if not sel:
        return
    for curve in sel:
        # Toutes les clés de la courbe
        all_times = cmds.keyframe(curve, q=True, tc=True)
        all_values = cmds.keyframe(curve, q=True, vc=True)
        if not all_times or not all_values:
            continue
        original_curves[curve] = list(zip(all_times, all_values))
        # Les clés sélectionnées
        sel_times = cmds.keyframe(curve, q=True, sl=True, tc=True)
        if sel_times:
            selected_keys[curve] = sel_times

def hermite_interp(t0, v0, t1, v1, m0, m1, t):
    """Interpolation cubique Hermite (pour tangentes lisses)."""
    h = t1 - t0
    if h == 0:
        return v0
    s = (t - t0) / h
    h00 = 2*s**3 - 3*s**2 + 1
    h10 = s**3 - 2*s**2 + s
    h01 = -2*s**3 + 3*s**2
    h11 = s**3 - s**2
    return h00*v0 + h10*m0*h + h01*v1 + h11*m1*h

def eval_curve_offset(curve, time, offset):
    """Évalue la valeur de la courbe originale décalée de offset à un temps donné (avec Hermite)."""
    keys = original_curves[curve]
    times = [t + offset for t, v in keys]
    values = [v for t, v in keys]
    n = len(times)
    if time <= times[0]:
        return values[0]
    if time >= times[-1]:
        return values[-1]
    for i in range(1, n):
        if time < times[i]:
            t0, v0 = times[i-1], values[i-1]
            t1, v1 = times[i], values[i]
            # Tangentes (simple diff, tu peux raffiner avec tangentes Maya si besoin)
            if i == 1:
                m0 = (v1 - v0) / (t1 - t0)
            else:
                m0 = (values[i-1] - values[i-2]) / (times[i-1] - times[i-2])
            if i == n-1:
                m1 = (v1 - v0) / (t1 - t0)
            else:
                m1 = (values[i+1] - v0) / (times[i+1] - t0)
            return hermite_interp(t0, v0, t1, v1, m0, m1, time)
    return values[-1]

def time_offsetter_apply(offset):
    global original_curves, selected_keys, undo_open
    if not undo_open:
        store_original_curves_and_keys()
        cmds.undoInfo(openChunk=True)
        undo_open = True

    if not original_curves or not selected_keys:
        return

    for curve, times in selected_keys.items():
        for t in times:
            new_val = eval_curve_offset(curve, t, offset)
            cmds.keyframe(curve, edit=True, time=(t,), valueChange=new_val)

def time_offsetter_release(offset):
    global undo_open
    if undo_open:
        cmds.undoInfo(closeChunk=True)
        undo_open = False
    # Reset le slider à zéro
    cmds.floatSlider('offsetSlider', e=True, value=0)

def show_time_offsetter():
    global undo_open
    undo_open = False

    if cmds.window("timeOffsetterWin", exists=True):
        cmds.deleteUI("timeOffsetterWin")

    sel = cmds.keyframe(q=True, sl=True, name=True)
    if not sel:
        cmds.warning("Sélectionne au moins une courbe avec des clés.")
        return

    all_times = []
    for curve in sel:
        times = cmds.keyframe(curve, q=True, sl=True, tc=True)
        if times:
            all_times.extend(times)
    if not all_times:
        cmds.warning("Aucune clé sélectionnée.")
        return

    min_time = min(all_times)
    max_time = max(all_times)
    max_offset = max_time - min_time

    cmds.window("timeOffsetterWin", title="Time Offsetter du pauvre !", widthHeight=(300, 100))
    cmds.columnLayout(adjustableColumn=True)
    cmds.text(label="Décale la courbe sans bouger les clés")
    cmds.text(label="Offset")
    cmds.floatSlider(
        'offsetSlider',
        min=-max_offset, max=max_offset, value=0, step=0.1,
        dragCommand=time_offsetter_apply,
        changeCommand=time_offsetter_release
    )
    cmds.showWindow("timeOffsetterWin")

show_time_offsetter()