
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedFlow } from '@/context/MedFlowContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Patient } from '@/types';
import { Plus, Search, FileText, UserPlus, Users, Trash2, PencilIcon, ChevronRight } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { patients, setCurrentPatient, addPatient, updatePatient, deletePatient } = useMedFlow();
  const [search, setSearch] = useState('');
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [newPatient, setNewPatient] = useState<Omit<Patient, 'id'>>({
    name: '',
    age: 0,
    gender: '',
    dob: '',
    mrn: '',
    status: 'active'
  });

  const handlePatientSelect = (patient: Patient) => {
    setCurrentPatient(patient);
    navigate('/workflow');
  };

  const handleAddPatient = () => {
    const patient: Patient = {
      ...newPatient,
      id: `pat-${Date.now()}`,
    };
    addPatient(patient);
    setShowAddPatient(false);
    // Reset form
    setNewPatient({
      name: '',
      age: 0,
      gender: '',
      dob: '',
      mrn: '',
      status: 'active'
    });
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      dob: patient.dob,
      mrn: patient.mrn,
      status: patient.status
    });
    setShowEditPatient(true);
  };

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDeleteConfirm(true);
  };

  const handleUpdatePatient = () => {
    if (selectedPatient) {
      const updatedPatient: Patient = {
        ...selectedPatient,
        ...newPatient
      };
      updatePatient(updatedPatient);
      setShowEditPatient(false);
      // Reset form
      setNewPatient({
        name: '',
        age: 0,
        gender: '',
        dob: '',
        mrn: '',
        status: 'active'
      });
      setSelectedPatient(null);
    }
  };

  const handleDeletePatient = () => {
    if (selectedPatient) {
      deletePatient(selectedPatient.id);
      setShowDeleteConfirm(false);
      setSelectedPatient(null);
    }
  };

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(search.toLowerCase()) || 
    patient.mrn.toLowerCase().includes(search.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value
    }));
  };

  const handleSelectChange = (field: string) => (value: string) => {
    setNewPatient(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Extract the patient ID from the full ID (e.g., "pat-1234567" -> "1234")
  const getShortId = (fullId: string) => {
    const parts = fullId.split('-');
    if (parts.length > 1) {
      return parts[1].substring(0, 4);
    }
    return fullId.substring(0, 4);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage patient records and documentation</p>
        </div>
        <div>
          <Button 
            onClick={() => setShowAddPatient(true)}
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Patients</CardTitle>
            <CardDescription>Active patient records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary" />
              <span className="text-3xl font-bold ml-3">{patients.length}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Patients</CardTitle>
            <CardDescription>Currently in treatment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold ml-3">
                {patients.filter(p => p.status === 'active').length}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm hover:shadow transition-shadow duration-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Pending Review</CardTitle>
            <CardDescription>Documentation awaiting review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-amber-500" />
              <span className="text-3xl font-bold ml-3">
                {patients.filter(p => p.status === 'pending').length}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>View and manage patient documentation</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search patients..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 w-full md:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">DOB</TableHead>
                  <TableHead className="hidden md:table-cell">Gender</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50/80">
                    <TableCell className="font-medium">{getShortId(patient.id)}</TableCell>
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.dob}</TableCell>
                    <TableCell className="hidden md:table-cell">{patient.gender}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === 'active' ? 'bg-green-100 text-green-800' : 
                        patient.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePatientSelect(patient)}
                          className="hover:bg-primary/10 text-primary flex items-center"
                        >
                          Open 
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(patient)}
                          className="hover:bg-blue-50 text-blue-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(patient)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only md:not-sr-only md:ml-1">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPatients.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No patients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Patient Dialog */}
      <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={newPatient.name}
                onChange={handleInputChange}
                placeholder="Enter patient name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                type="number"
                value={newPatient.age}
                onChange={handleInputChange}
                placeholder="Enter age"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select onValueChange={handleSelectChange("gender")} value={newPatient.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                name="dob"
                type="date"
                value={newPatient.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mrn">Medical Record Number</Label>
              <Input
                id="mrn"
                name="mrn"
                value={newPatient.mrn}
                onChange={handleInputChange}
                placeholder="Enter MRN"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select onValueChange={handleSelectChange("status")} value={newPatient.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPatient(false)}>Cancel</Button>
            <Button onClick={handleAddPatient}>Add Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Patient Dialog */}
      <Dialog open={showEditPatient} onOpenChange={setShowEditPatient}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Patient</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={newPatient.name}
                onChange={handleInputChange}
                placeholder="Enter patient name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-age">Age</Label>
              <Input
                id="edit-age"
                name="age"
                type="number"
                value={newPatient.age}
                onChange={handleInputChange}
                placeholder="Enter age"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-gender">Gender</Label>
              <Select onValueChange={handleSelectChange("gender")} value={newPatient.gender}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-dob">Date of Birth</Label>
              <Input
                id="edit-dob"
                name="dob"
                type="date"
                value={newPatient.dob}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-mrn">Medical Record Number</Label>
              <Input
                id="edit-mrn"
                name="mrn"
                value={newPatient.mrn}
                onChange={handleInputChange}
                placeholder="Enter MRN"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select onValueChange={handleSelectChange("status")} value={newPatient.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditPatient(false)}>Cancel</Button>
            <Button onClick={handleUpdatePatient}>Update Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the patient
              record for {selectedPatient?.name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePatient}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
