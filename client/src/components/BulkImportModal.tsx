import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileJson, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '../services/api';

interface BulkImportModalProps {
  quizId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  quizId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [inputText, setInputText] = useState('');
  const [format, setFormat] = useState<'JSON' | 'CSV'>('JSON');
  const [validationErrors, setValidationErrors] = useState<{ row: number; message: string }[]>([]);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const sampleJson = `[
  {
    "type": "SINGLE_CHOICE",
    "text": "What is the default port for Express.js development?",
    "points": 10,
    "explanation": "Port 3000 or 5000 are standard development defaults.",
    "options": [
      { "text": "3000", "isCorrect": true },
      { "text": "8080", "isCorrect": false },
      { "text": "5432", "isCorrect": false }
    ]
  }
]`;

  const parseInput = () => {
    setServerError(null);
    setValidationErrors([]);
    setParsedQuestions([]);

    if (!inputText.trim()) {
      setServerError('Please enter or paste question data to validate.');
      return;
    }

    if (format === 'JSON') {
      try {
        const json = JSON.parse(inputText);
        if (!Array.isArray(json)) {
          setServerError('JSON data must be an array of question objects.');
          return;
        }

        const errors: { row: number; message: string }[] = [];
        json.forEach((q: any, idx: number) => {
          const rowNum = idx + 1;
          if (!q.text || typeof q.text !== 'string' || q.text.length < 3) {
            errors.push({ row: rowNum, message: 'Question text must be at least 3 characters.' });
          }
          if (!Array.isArray(q.options) || q.options.length < 2) {
            errors.push({ row: rowNum, message: 'Question must have at least 2 options.' });
          } else {
            const hasCorrect = q.options.some((o: any) => o.isCorrect === true);
            if (!hasCorrect) {
              errors.push({ row: rowNum, message: 'Question must have at least 1 correct option.' });
            }
          }
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
        } else {
          setParsedQuestions(json);
        }
      } catch (e: any) {
        setServerError(`JSON Syntax Error: ${e.message}`);
      }
    } else {
      // Basic CSV Parser (Format: type,text,points,explanation,option1,isCorrect1,option2,isCorrect2,...)
      try {
        const lines = inputText.trim().split('\n');
        const errors: { row: number; message: string }[] = [];
        const questions: any[] = [];

        lines.forEach((line, idx) => {
          const rowNum = idx + 1;
          const cols = line.split(',').map((c) => c.trim());
          if (cols.length < 6) {
            errors.push({ row: rowNum, message: 'Row does not contain enough CSV columns.' });
            return;
          }

          const type = cols[0].toUpperCase() as any;
          const text = cols[1];
          const points = parseInt(cols[2]) || 10;
          const explanation = cols[3];

          const options: any[] = [];
          for (let i = 4; i < cols.length; i += 2) {
            if (cols[i]) {
              options.push({
                text: cols[i],
                isCorrect: cols[i + 1]?.toLowerCase() === 'true',
              });
            }
          }

          if (options.length < 2) {
            errors.push({ row: rowNum, message: 'CSV row must have at least 2 options.' });
          } else if (!options.some((o) => o.isCorrect)) {
            errors.push({ row: rowNum, message: 'CSV row must have at least 1 correct option.' });
          } else {
            questions.push({ type, text, points, explanation, options });
          }
        });

        if (errors.length > 0) {
          setValidationErrors(errors);
        } else {
          setParsedQuestions(questions);
        }
      } catch (e: any) {
        setServerError(`CSV Parser Error: ${e.message}`);
      }
    }
  };

  const handleImport = async () => {
    if (parsedQuestions.length === 0) return;
    setIsSubmitting(true);
    setServerError(null);

    try {
      await apiRequest(`/admin/quizzes/${quizId}/bulk-import`, {
        method: 'POST',
        body: JSON.stringify({ questions: parsedQuestions }),
      });

      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err: any) {
      setIsSubmitting(false);
      setServerError(err.message || 'Failed to bulk import questions');
      if (err.errors) {
        setValidationErrors(err.errors);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setInputText(content);
      if (file.name.endsWith('.json')) setFormat('JSON');
      if (file.name.endsWith('.csv')) setFormat('CSV');
    };
    reader.readAsText(file);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-xl bg-slate-800/80"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="font-display font-bold text-2xl text-slate-100 flex items-center gap-2 mb-1">
            <Upload className="w-6 h-6 text-purple-400" /> Bulk Import Questions
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Import multiple questions at once using JSON format or CSV spreadsheet format.
          </p>

          {/* Format Selector */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => { setFormat('JSON'); setInputText(sampleJson); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-semibold text-xs border transition-all ${
                format === 'JSON'
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <FileJson className="w-4 h-4" /> JSON Format
            </button>
            <button
              onClick={() => setFormat('CSV')}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-display font-semibold text-xs border transition-all ${
                format === 'CSV'
                  ? 'bg-teal-900/60 border-teal-500 text-teal-200'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              <FileText className="w-4 h-4" /> CSV Format
            </button>

            <label className="ml-auto cursor-pointer bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-4 py-2 rounded-2xl font-display font-semibold text-xs flex items-center gap-2">
              <Upload className="w-4 h-4" /> Upload File
              <input type="file" accept=".json,.csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Text Input Area */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            placeholder={
              format === 'JSON'
                ? sampleJson
                : 'SINGLE_CHOICE, What is 2+2?, 10, Explanation, 4, true, 5, false'
            }
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500 mb-4"
          />

          {/* Error display */}
          {serverError && (
            <div className="p-3 mb-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {serverError}
            </div>
          )}

          {validationErrors.length > 0 && (
            <div className="p-3 mb-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              <div className="font-bold mb-1 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> Validation Failed ({validationErrors.length} errors):
              </div>
              <ul className="list-disc pl-5 space-y-1">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>Row {err.row}: {err.message}</li>
                ))}
              </ul>
            </div>
          )}

          {parsedQuestions.length > 0 && validationErrors.length === 0 && (
            <div className="p-3 mb-4 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              Valid! Ready to import {parsedQuestions.length} questions.
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={parseInput}
              className="btn-game btn-game-gray px-5 py-2.5 text-xs"
            >
              Validate & Preview
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={parsedQuestions.length === 0 || isSubmitting}
              className={`btn-game btn-game-purple px-6 py-2.5 text-xs ${
                parsedQuestions.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Importing...' : `Import ${parsedQuestions.length} Questions`}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
