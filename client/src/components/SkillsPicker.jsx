import React, { useMemo, useState } from 'react';

const SkillsPicker = ({
  title,
  availableSkills = [],
  initialSelected = [],
  max = 5,
  onCancel,
  onSave
}) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(() => new Set(initialSelected));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return availableSkills;
    return availableSkills.filter(s => s.toLowerCase().includes(q));
  }, [availableSkills, query]);

  const toggle = (skill) => {
    const next = new Set(selected);
    if (next.has(skill)) {
      next.delete(skill);
    } else if (next.size < max) {
      next.add(skill);
    }
    setSelected(next);
  };

  const remove = (skill) => {
    if (!selected.has(skill)) return;
    const next = new Set(selected);
    next.delete(skill);
    setSelected(next);
  };

  const selectedArray = Array.from(selected);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">×</button>
          </div>

          {/* Selected chips */}
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {selectedArray.map((s) => (
                <span key={s} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                  {s}
                  <button onClick={() => remove(s)} className="text-orange-700/70 hover:text-orange-800">×</button>
                </span>
              ))}
              {selectedArray.length === 0 && (
                <span className="text-sm text-gray-500">No skills selected</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{selectedArray.length}/{max} selected</p>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search skills..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* List */}
          <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
            {filtered.map((skill) => {
              const checked = selected.has(skill);
              const disabled = !checked && selected.size >= max;
              return (
                <label key={skill} className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${disabled ? 'opacity-50' : 'hover:bg-gray-50'}`}>
                  <span className="text-sm text-gray-800">{skill}</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={disabled}
                    onChange={() => toggle(skill)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                </label>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-sm text-gray-600 px-3 py-4 text-center">
                No skills found. 
                {query.trim() && (
                  <button
                    type="button"
                    onClick={() => {
                      const val = query.trim();
                      if (!val) return;
                      if (selected.has(val) || availableSkills.includes(val)) return;
                      if (selected.size >= max) return;
                      const next = new Set(selected);
                      next.add(val);
                      setSelected(next);
                    }}
                    className="ml-1 underline text-orange-600 hover:text-orange-700"
                  >
                    Add "{query.trim()}" as other
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button onClick={onCancel} className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button onClick={() => onSave(selectedArray)} className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50" disabled={selectedArray.length === 0}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsPicker;


